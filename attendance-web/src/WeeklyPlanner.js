import React, { useState, useEffect } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { styles } from "./styles";

export default function WeeklyPlanner({ userMode, lang }) {
    const [materials, setMaterials] = useState([]);
    const [uploadingId, setUploadingId] = useState(null);

    const text = {
        ko: {
            week: "주차",
            uploadBtn: "+ 자료 등록",
            uploading: "업로드 중...",
            noData: "등록된 강의 자료가 없습니다.",
            delete: "삭제",
            download: "다운로드",
            alertUploaded: "자료가 업로드되었습니다.",
            alertFail: "업로드 실패",
            confirmDelete: "자료를 삭제하시겠습니까?"
        },
        en: {
            week: "Week",
            uploadBtn: "+ Add Resource",
            uploading: "Uploading...",
            noData: "No resources available.",
            delete: "Delete",
            download: "Download",
            alertUploaded: "Resource uploaded.",
            alertFail: "Upload Failed",
            confirmDelete: "Are you sure you want to delete?"
        }
    };
    const t = text[lang];

    const weeksDataRaw = {
        ko: [
            { id: 1, title: "강의소개 (OT)", desc: "강의 목표, 평가 방법, 선수 과목 확인" },
            { id: 2, title: "TypeScript 기초", desc: "타입 시스템, 인터페이스, 제네릭 이해" },
            { id: 3, title: "프론트엔드 기초", desc: "TypeScript와 Vue.js 연동 및 기본 구조" },
            { id: 4, title: "Git 기초", desc: "버전 관리 시스템의 이해 및 설치" },
            { id: 5, title: "Git & GitHub Actions/Pages", desc: "CI/CD 파이프라인 구축 및 정적 배포" },
            { id: 6, title: "Design Pattern 1", desc: "MVC, MVVM 등 프론트엔드 아키텍처 패턴" },
            { id: 7, title: "Design Pattern 2", desc: "Singleton, Factory, Observer 패턴 실습" },
            { id: 8, title: "중간 발표 & Firebase 소개", desc: "중간 점검 및 Firebase Ecosystem 이해" },
            { id: 9, title: "API & Firebase, AI + Streamlit", desc: "REST API, Firestore, Streamlit 활용 AI 앱" },
            { id: 10, title: "웹 개발 기초 1 (React/Vue)", desc: "컴포넌트 생명주기 및 상태 관리 (Basic)" },
            { id: 11, title: "웹 개발 기초 2 (React/Vue)", desc: "라우팅, 전역 상태 관리 (Advanced)" },
            { id: 12, title: "모바일 개발 기초 1", desc: "React Native/Flutter 환경 설정 및 기초" },
            { id: 13, title: "모바일 개발 기초 2", desc: "네이티브 기능 연동 및 UI 레이아웃" },
            { id: 14, title: "모바일 개발 기초 3", desc: "심화 기능 구현 및 앱 배포 프로세스" },
            { id: 15, title: "최종 발표", desc: "Term Project 최종 시연 및 동료 평가" }
        ],
        en: [
            { id: 1, title: "Introduction (OT)", desc: "Course goals, grading, prerequisites" },
            { id: 2, title: "TypeScript Basics", desc: "Type system, interfaces, generics" },
            { id: 3, title: "Frontend Basics", desc: "TypeScript & Vue.js structure" },
            { id: 4, title: "Git Basics", desc: "Version control system & installation" },
            { id: 5, title: "Git & GitHub Actions", desc: "CI/CD pipelines & static deployment" },
            { id: 6, title: "Design Pattern 1", desc: "Frontend patterns: MVC, MVVM" },
            { id: 7, title: "Design Pattern 2", desc: "Singleton, Factory, Observer patterns" },
            { id: 8, title: "Mid-term & Firebase", desc: "Progress check & Firebase ecosystem" },
            { id: 9, title: "API & AI Integration", desc: "REST API, Firestore, Streamlit AI App" },
            { id: 10, title: "Web Dev Basics 1", desc: "React/Vue Components & State" },
            { id: 11, title: "Web Dev Basics 2", desc: "Routing & Global State" },
            { id: 12, title: "Mobile Dev 1", desc: "React Native/Flutter Setup" },
            { id: 13, title: "Mobile Dev 2", desc: "Native Features & UI Layout" },
            { id: 14, title: "Mobile Dev 3", desc: "Advanced Features & Deployment" },
            { id: 15, title: "Final Presentation", desc: "Term Project Demo & Peer Review" }
        ]
    };

    const weeksData = weeksDataRaw[lang];

    useEffect(() => {
        const q = query(collection(db, "materials"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleUpload = async (e, weekId) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingId(weekId);
        try {
            const storageRef = ref(storage, `materials/week${weekId}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            await addDoc(collection(db, "materials"), {
                weekId,
                fileName: file.name,
                fileUrl: url,
                createdAt: new Date()
            });
            alert(t.alertUploaded);
        } catch (err) {
            console.error(err);
            alert(t.alertFail);
        }
        setUploadingId(null);
    };

    const handleDelete = async (id, fileName, weekId) => {
        if (!window.confirm(t.confirmDelete)) return;
        try {
            await deleteDoc(doc(db, "materials", id));
            const storageRef = ref(storage, `materials/week${weekId}_${fileName}`);
            await deleteObject(storageRef).catch(() => {});
        } catch (e) {
            alert("Error");
        }
    };

    const getWeekMaterials = (weekId) => materials.filter(m => m.weekId === weekId);

    return (
        <div className="fade-in">
            <div style={styles.weekList}>
                {weeksData.map((week) => (
                    <div key={week.id} style={{...styles.weekCard, flexDirection:'column', alignItems:'stretch'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                                <div style={{fontSize:'18px', fontWeight:'900', color:'#10316b', width:'60px'}}>{week.id}{t.week}</div>
                                <div>
                                    <div style={{fontWeight:'bold', fontSize:'16px'}}>{week.title}</div>
                                    <div style={{fontSize:'13px', color:'#666', marginTop:'4px'}}>{week.desc}</div>
                                </div>
                            </div>

                            {userMode === 'admin' && (
                                <div>
                                    <input
                                        type="file"
                                        id={`mat-${week.id}`}
                                        style={{display:'none'}}
                                        onChange={(e) => handleUpload(e, week.id)}
                                        disabled={uploadingId === week.id}
                                    />
                                    <label htmlFor={`mat-${week.id}`} style={styles.uploadBtn}>
                                        {uploadingId === week.id ? t.uploading : t.uploadBtn}
                                    </label>
                                </div>
                            )}
                        </div>

                        <div style={{borderTop:'1px solid #eee', paddingTop:'10px'}}>
                            {getWeekMaterials(week.id).length === 0 ? (
                                <div style={{fontSize:'12px', color:'#aaa', paddingLeft:'80px'}}>{t.noData}</div>
                            ) : (
                                <ul style={{listStyle:'none', padding:'0 0 0 80px', margin:0}}>
                                    {getWeekMaterials(week.id).map(mat => (
                                        <li key={mat.id} style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'5px'}}>
                                            <span style={{fontSize:'14px'}}>📄</span>
                                            <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={{fontSize:'13px', color:'#333', textDecoration:'none', flex:1, fontWeight:'bold'}}>
                                                {mat.fileName}
                                            </a>

                                            {/* 학생일 땐 다운로드 버튼 표시 */}
                                            {userMode === 'student' && (
                                                <a
                                                    href={mat.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{fontSize:'12px', color:'white', backgroundColor:'#10316b', padding:'4px 8px', borderRadius:'4px', textDecoration:'none'}}
                                                >
                                                    {t.download}
                                                </a>
                                            )}

                                            {/* 교수일 땐 삭제 버튼 표시 */}
                                            {userMode === 'admin' && (
                                                <span
                                                    onClick={() => handleDelete(mat.id, mat.fileName, week.id)}
                                                    style={{fontSize:'11px', color:'red', cursor:'pointer', border:'1px solid #eee', padding:'2px 5px', borderRadius:'4px'}}
                                                >
                          {t.delete}
                        </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
import React, { useState, useEffect } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { styles } from "./styles";

export default function Assignment({ userMode, studentInfo, lang }) { // lang prop 추가
    const [submissions, setSubmissions] = useState([]);
    const [uploading, setUploading] = useState(false);

    const text = {
        ko: {
            adminTitle: "과제 제출 현황 (교수용)",
            studentTitle: "나의 과제 제출",
            uploading: "업로드 중...",
            selectFile: "파일 선택 및 제출",
            submitted: "✅ 제출 완료",
            notSubmitted: "미제출",
            download: "다운로드",
            noSubmissions: "제출된 과제가 없습니다.",
            thTitle: "과제명",
            thId: "학번",
            thName: "이름",
            thDate: "제출일",
            thFile: "첨부파일",
            alertSuccess: "제출 완료!",
            alertFail: "업로드 실패: Firebase Storage 설정을 확인하세요."
        },
        en: {
            adminTitle: "Submission Status (Admin)",
            studentTitle: "My Submissions",
            uploading: "Uploading...",
            selectFile: "Select & Submit File",
            submitted: "✅ Submitted",
            notSubmitted: "Missing",
            download: "Download",
            noSubmissions: "No submissions yet.",
            thTitle: "Assignment",
            thId: "Student ID",
            thName: "Name",
            thDate: "Date",
            thFile: "File",
            alertSuccess: "Submission Successful!",
            alertFail: "Upload Failed: Check Firebase Storage settings."
        }
    };
    const t = text[lang];

    const assignments = [
        { id: 1, title: "Assignment 1: Portfolio Page", due: "2025-10-15" },
        { id: 2, title: "Assignment 2: Netflix Clone", due: "2025-11-20" },
        { id: 3, title: "Term Project Interim Report", due: "2025-12-01" },
    ];

    useEffect(() => {
        let q;
        if (userMode === "student" && studentInfo) {
            q = query(collection(db, "submissions"), where("studentId", "==", studentInfo.studentId));
        } else {
            q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(list);
        });
        return () => unsubscribe();
    }, [userMode, studentInfo]);

    const handleFileUpload = async (event, assignmentId, assignmentTitle) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `submissions/${assignmentId}_${studentInfo.studentId}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);

            await addDoc(collection(db, "submissions"), {
                assignmentId,
                assignmentTitle,
                studentId: studentInfo.studentId,
                studentName: studentInfo.name,
                fileName: file.name,
                fileUrl: downloadUrl,
                submittedAt: new Date()
            });

            alert(t.alertSuccess);
        } catch (error) {
            console.error(error);
            alert(t.alertFail);
        }
        setUploading(false);
    };

    const getMySubmission = (assignmentId) => {
        return submissions.find(s => s.assignmentId === assignmentId);
    };

    return (
        <div className="fade-in">
            <div style={styles.sectionBox}>
                <div style={styles.sectionTitle}>
                    {userMode === "admin" ? t.adminTitle : t.studentTitle}
                </div>

                {userMode === "student" ? (
                    <div>
                        {assignments.map(assign => {
                            const mySub = getMySubmission(assign.id);
                            return (
                                <div key={assign.id} style={styles.assignmentCard}>
                                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                                        <div>
                                            <div style={{fontSize:'18px', fontWeight:'bold', color:'#2d3748'}}>{assign.title}</div>
                                            <div style={{fontSize:'13px', color:'#718096', marginTop:'5px'}}>Due: {assign.due}</div>
                                        </div>
                                        {mySub ? (
                                            <span style={{color:'#48bb78', fontWeight:'bold', fontSize:'14px'}}>{t.submitted} ({new Date(mySub.submittedAt.toDate()).toLocaleDateString()})</span>
                                        ) : (
                                            <span style={{color:'#e53e3e', fontWeight:'bold', fontSize:'14px'}}>{t.notSubmitted}</span>
                                        )}
                                    </div>

                                    {mySub ? (
                                        <div style={{backgroundColor:'#f7fafc', padding:'15px', borderRadius:'6px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                            <span style={{fontSize:'14px'}}>📄 {mySub.fileName}</span>
                                            <a href={mySub.fileUrl} target="_blank" rel="noreferrer" style={styles.downloadLink}>{t.download}</a>
                                        </div>
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                id={`file-${assign.id}`}
                                                style={styles.fileInput}
                                                onChange={(e) => handleFileUpload(e, assign.id, assign.title)}
                                                disabled={uploading}
                                            />
                                            <label htmlFor={`file-${assign.id}`} style={uploading ? {...styles.fileLabel, backgroundColor:'#cbd5e0'} : styles.fileLabel}>
                                                {uploading ? t.uploading : t.selectFile}
                                            </label>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th>{t.thTitle}</th>
                            <th>{t.thId}</th>
                            <th>{t.thName}</th>
                            <th>{t.thDate}</th>
                            <th>{t.thFile}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {submissions.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'#999'}}>{t.noSubmissions}</td></tr> :
                            submissions.map(sub => (
                                <tr key={sub.id}>
                                    <td>{sub.assignmentTitle}</td>
                                    <td>{sub.studentId}</td>
                                    <td style={{fontWeight:'bold'}}>{sub.studentName}</td>
                                    <td>{new Date(sub.submittedAt.toDate()).toLocaleString()}</td>
                                    <td>
                                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={styles.downloadLink}>
                                            💾 {t.download}
                                        </a>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, getDocs, addDoc } from "firebase/firestore";
import { styles } from "./styles";

export default function StudentDashboard({ studentInfo, lang }) {
    const [myAttendance, setMyAttendance] = useState([]);
    const [myGrade, setMyGrade] = useState(null);
    const [inputCode, setInputCode] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const text = {
        ko: {
            alertTitle: "🚨 마감 임박 과제",
            alertDesc: "과제 2: Netflix 클론 코딩 (마감: 2025-11-20)",
            goBtn: "바로가기",
            attendTitle: "📢 실시간 출석 체크",
            attendDesc: "교수님이 알려주신 4자리 번호를 입력하세요.",
            attendPlaceholder: "1234",
            attendBtn: "출석하기",
            statRate: "나의 출석률",
            statWeek: "주차",
            statGrade: "현재 예상 학점",
            statScore: "종합 점수",
            gradeTitle: "성적 상세 내역",
            thItem: "평가 항목",
            thScore: "배점",
            thMyScore: "내 점수",
            itemA1: "과제 1",
            itemA2: "과제 2",
            itemTP: "Term Project",
            itemAtt: "출석 점수",
            itemLab: "실습 점수",
            total: "총점",
            noGrade: "성적 데이터가 없습니다.",
            historyTitle: "최근 출석 기록",
            thDate: "날짜",
            thTime: "시간",
            thStatus: "상태",
            statusOk: "출석 완료",
            noHistory: "출석 기록이 없습니다.",
            alertSuccess: "출석체크 성공!",
            alertError: "유효하지 않은 코드거나 출석 시간이 아닙니다.",
            alertDup: "이미 출석 처리가 완료되었습니다."
        },
        en: {
            alertTitle: "🚨 Deadline Approaching",
            alertDesc: "Assignment 2: Netflix Clone (Due: 2025-11-20)",
            goBtn: "Go Now",
            attendTitle: "📢 Live Attendance",
            attendDesc: "Enter the 4-digit code provided by the professor.",
            attendPlaceholder: "Code",
            attendBtn: "Check-in",
            statRate: "Attendance Rate",
            statWeek: "Weeks",
            statGrade: "Estimated Grade",
            statScore: "Total Score",
            gradeTitle: "Grade Details",
            thItem: "Item",
            thScore: "Max",
            thMyScore: "My Score",
            itemA1: "Assign 1",
            itemA2: "Assign 2",
            itemTP: "Term Project",
            itemAtt: "Attendance",
            itemLab: "Lab Score",
            total: "Total",
            noGrade: "No grade data available.",
            historyTitle: "Recent History",
            thDate: "Date",
            thTime: "Time",
            thStatus: "Status",
            statusOk: "Present",
            noHistory: "No attendance records.",
            alertSuccess: "Check-in Successful!",
            alertError: "Invalid code or session closed.",
            alertDup: "You have already checked in."
        }
    };
    const t = text[lang];

    useEffect(() => {
        if (!studentInfo) return;

        setTimeout(() => setIsLoading(false), 800);

        const qAttend = query(
            collection(db, "attendance"),
            where("studentId", "==", studentInfo.studentId)
        );
        const unsubscribeAttend = onSnapshot(qAttend, (snapshot) => {
            setMyAttendance(snapshot.docs.map(doc => doc.data()));
        });

        const qGrade = query(
            collection(db, "students"),
            where("studentId", "==", studentInfo.studentId)
        );
        const unsubscribeGrade = onSnapshot(qGrade, (snapshot) => {
            if (!snapshot.empty) {
                setMyGrade(snapshot.docs[0].data());
            }
        });

        return () => {
            unsubscribeAttend();
            unsubscribeGrade();
        };
    }, [studentInfo]);

    const handleAttendanceSubmit = async () => {
        if (!inputCode) return;
        try {
            const qSession = query(
                collection(db, "sessions"),
                where("code", "==", inputCode),
                where("isOpen", "==", true)
            );
            const sessionSnap = await getDocs(qSession);

            if (sessionSnap.empty) {
                alert(t.alertError);
                return;
            }

            const alreadyAttended = myAttendance.some(att => att.code === inputCode);
            if (alreadyAttended) {
                alert(t.alertDup);
                return;
            }

            await addDoc(collection(db, "attendance"), {
                studentId: studentInfo.studentId,
                name: studentInfo.name,
                code: inputCode,
                timestamp: new Date()
            });

            alert(t.alertSuccess);
            setInputCode("");
        } catch (e) {
            console.error(e);
            alert("Error");
        }
    };

    const calculateTotal = () => {
        if (!myGrade) return 0;
        return (myGrade.a1 || 0) + (myGrade.a2 || 0) + (myGrade.tp || 0) + (myGrade.att || 0) + (myGrade.lab || 0);
    };

    const getGrade = (total) => {
        if (total >= 95) return "A+";
        if (total >= 90) return "A";
        if (total >= 85) return "B+";
        if (total >= 80) return "B";
        if (total >= 75) return "C+";
        if (total >= 70) return "C";
        if (total >= 60) return "D";
        return "F";
    };

    const SkeletonLine = ({ width, height }) => (
        <div style={{ ...styles.skeleton, width: width || "100%", height: height || "20px", marginBottom: "10px" }}></div>
    );

    return (
        <div className="fade-in" style={{maxWidth:'1000px', margin:'0 auto', width:'100%'}}>

            <div style={styles.alertCard}>
                <div>
                    <div style={{fontWeight:'bold', color:'#c53030'}}>{t.alertTitle}</div>
                    <div style={{fontSize:'14px', color:'#4a5568'}}>{t.alertDesc}</div>
                </div>
                <button style={{padding:'8px 16px', background:'white', border:'1px solid #c53030', color:'#c53030', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}>
                    {t.goBtn}
                </button>
            </div>

            <div style={styles.studentAttendBox}>
                <div>
                    <div style={{fontWeight:'bold', fontSize:'18px', color:'#10316b', marginBottom:'5px'}}>{t.attendTitle}</div>
                    <div style={{fontSize:'14px', color:'#555'}}>{t.attendDesc}</div>
                </div>
                <div>
                    <input
                        style={styles.attendInput}
                        maxLength={4}
                        placeholder={t.attendPlaceholder}
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAttendanceSubmit()}
                    />
                    <button style={styles.attendBtn} onClick={handleAttendanceSubmit}>{t.attendBtn}</button>
                </div>
            </div>

            <div style={styles.gridContainer}>
                <div style={{...styles.statCard, cursor:'default'}} className="card-hover">
                    <div style={styles.statLabel}>{t.statRate}</div>
                    {isLoading ? <SkeletonLine width="60px" height="40px" /> : (
                        <>
                            <div style={{...styles.statValue, color:'#10316b'}}>{((myAttendance.length / 15) * 100).toFixed(0)}%</div>
                            <div style={styles.progressBarContainer}>
                                <div style={{...styles.progressBarValue, width: `${(myAttendance.length / 15) * 100}%`}}></div>
                            </div>
                            <div style={{fontSize:'12px', color:'#999', marginTop:'5px'}}>{myAttendance.length} / 15 {t.statWeek}</div>
                        </>
                    )}
                </div>
                <div style={{...styles.statCard, cursor:'default'}} className="card-hover">
                    <div style={styles.statLabel}>{t.statGrade}</div>
                    {isLoading ? <SkeletonLine width="60px" height="40px" /> : (
                        <div style={{...styles.statValue, color:'#48bb78'}}>{getGrade(calculateTotal())}</div>
                    )}
                </div>
                <div style={{...styles.statCard, cursor:'default'}} className="card-hover">
                    <div style={styles.statLabel}>{t.statScore}</div>
                    {isLoading ? <SkeletonLine width="60px" height="40px" /> : (
                        <div style={styles.statValue}>{calculateTotal()}<span style={{fontSize:'16px', color:'#999'}}>/100</span></div>
                    )}
                </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px'}}>
                <div style={styles.sectionBox}>
                    <div style={styles.sectionTitle}>{t.gradeTitle}</div>
                    {isLoading ? <><SkeletonLine /><SkeletonLine /><SkeletonLine /></> : myGrade ? (
                        <table style={styles.table}>
                            <thead><tr><th>{t.thItem}</th><th>{t.thScore}</th><th>{t.thMyScore}</th></tr></thead>
                            <tbody>
                            <tr><td>{t.itemA1}</td><td>20</td><td style={{fontWeight:'bold'}}>{myGrade.a1}</td></tr>
                            <tr><td>{t.itemA2}</td><td>20</td><td style={{fontWeight:'bold'}}>{myGrade.a2}</td></tr>
                            <tr><td>{t.itemTP}</td><td>40</td><td style={{fontWeight:'bold'}}>{myGrade.tp}</td></tr>
                            <tr><td>{t.itemAtt}</td><td>10</td><td style={{fontWeight:'bold'}}>{myGrade.att}</td></tr>
                            <tr><td>{t.itemLab}</td><td>10</td><td style={{fontWeight:'bold'}}>{myGrade.lab}</td></tr>
                            <tr style={{background:'#f0f4ff'}}>
                                <td style={{fontWeight:'bold', color:'#10316b'}}>{t.total}</td>
                                <td>100</td>
                                <td style={{fontWeight:'bold', color:'#10316b', fontSize:'18px'}}>{calculateTotal()}</td>
                            </tr>
                            </tbody>
                        </table>
                    ) : <p>{t.noGrade}</p>}
                </div>

                <div style={styles.sectionBox}>
                    <div style={styles.sectionTitle}>{t.historyTitle}</div>
                    <table style={styles.table}>
                        <thead><tr><th>{t.thDate}</th><th>{t.thTime}</th><th>{t.thStatus}</th></tr></thead>
                        <tbody>
                        {isLoading ? <tr><td colSpan="3"><SkeletonLine /></td></tr> : myAttendance.length === 0 ? (
                            <tr><td colSpan="3" style={{textAlign:'center', padding:'20px', color:'#999'}}>{t.noHistory}</td></tr>
                        ) : (
                            myAttendance.sort((a,b) => b.timestamp - a.timestamp).map((att, i) => (
                                <tr key={i}>
                                    <td>{new Date(att.timestamp.toDate()).toLocaleDateString()}</td>
                                    <td>{new Date(att.timestamp.toDate()).toLocaleTimeString()}</td>
                                    <td><span style={styles.attendBadge}>{t.statusOk}</span></td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
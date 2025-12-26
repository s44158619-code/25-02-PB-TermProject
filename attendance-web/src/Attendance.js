import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, where, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import { styles } from "./styles";

export default function Attendance({ lang }) {
    const [code, setCode] = useState("");
    const [students, setStudents] = useState([]);
    const [sessionId, setSessionId] = useState(null);

    const text = {
        ko: {
            controlTitle: "출석 제어",
            startMsg: "수업 시작 시 인증번호를 생성하세요.",
            startBtn: "출석 시작하기",
            endBtn: "출석 마감하기",
            currentCode: "현재 인증번호",
            monitoring: "실시간 집계 중...",
            statusTitle: "출석 현황",
            countUnit: "명 출석",
            noData: "아직 출석한 학생이 없습니다.",
            tableNo: "No",
            tableDept: "학과",
            tableId: "학번",
            tableName: "이름",
            tableTime: "시간",
            tableStatus: "상태",
            statusOk: "출석",
            deptName: "컴퓨터인공지능"
        },
        en: {
            controlTitle: "Attendance Control",
            startMsg: "Generate a code to start attendance.",
            startBtn: "Start Attendance",
            endBtn: "Close Attendance",
            currentCode: "Current Code",
            monitoring: "Monitoring...",
            statusTitle: "Live Status",
            countUnit: " Checked-in",
            noData: "No students checked in yet.",
            tableNo: "No",
            tableDept: "Dept",
            tableId: "ID",
            tableName: "Name",
            tableTime: "Time",
            tableStatus: "Status",
            statusOk: "Present",
            deptName: "CS & AI"
        }
    };

    const t = text[lang];

    useEffect(() => {
        const checkActiveSession = async () => {
            const q = query(
                collection(db, "sessions"),
                where("isOpen", "==", true)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const activeSession = snapshot.docs[0];
                const sessionData = activeSession.data();
                setCode(sessionData.code);
                setSessionId(activeSession.id);
                listenAttendance(sessionData.code);
            }
        };
        checkActiveSession();
    }, []);

    const startClass = async () => {
        const q = query(collection(db, "sessions"), where("isOpen", "==", true));
        const snapshot = await getDocs(q);
        snapshot.forEach(async (docSnap) => {
            await updateDoc(doc(db, "sessions", docSnap.id), { isOpen: false });
        });

        const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
        setCode(randomCode);

        const docRef = await addDoc(collection(db, "sessions"), {
            code: randomCode,
            isOpen: true,
            createdAt: new Date(),
        });
        setSessionId(docRef.id);

        listenAttendance(randomCode);
    };

    const endClass = async () => {
        if (sessionId) {
            await updateDoc(doc(db, "sessions", sessionId), { isOpen: false });
            alert("출석이 마감되었습니다.");
            setCode("");
            setSessionId(null);
        }
    };

    const listenAttendance = (currentCode) => {
        const q = query(
            collection(db, "attendance"),
            where("code", "==", currentCode),
            orderBy("timestamp", "desc")
        );

        onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map((doc) => doc.data());
            setStudents(list);
        });
    };

    return (
        <div className="fade-in">
            <div style={styles.attendanceContainer}>
                <div style={styles.controlPanel}>
                    <h3 style={styles.subTitle}>{t.controlTitle}</h3>
                    {!code ? (
                        <div style={styles.startBox}>
                            <p style={{marginBottom:'15px', color:'#666'}}>{t.startMsg}</p>
                            <button onClick={startClass} style={styles.primaryBtnLarge}>{t.startBtn}</button>
                        </div>
                    ) : (
                        <div style={styles.activeBox}>
                            <p style={styles.activeLabel}>{t.currentCode}</p>
                            <div style={styles.codeDisplay}>{code}</div>
                            <div style={styles.pulseBadge}>{t.monitoring}</div>
                            <div style={{marginTop:'20px'}}>
                                <button
                                    onClick={endClass}
                                    style={{padding:'10px 20px', backgroundColor:'#e53e3e', color:'white', border:'none', borderRadius:'6px', fontWeight:'bold', cursor:'pointer'}}
                                >
                                    {t.endBtn}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div style={styles.listPanel}>
                    <div style={styles.listHeader}>
                        <h3>{t.statusTitle}</h3>
                        <span style={styles.countBadge}>{students.length}{t.countUnit}</span>
                    </div>
                    <div style={styles.studentListWrapper}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th>{t.tableNo}</th>
                                <th>{t.tableDept}</th>
                                <th>{t.tableId}</th>
                                <th>{t.tableName}</th>
                                <th>{t.tableTime}</th>
                                <th>{t.tableStatus}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.length === 0 ? (
                                <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#999'}}>{t.noData}</td></tr>
                            ) : (
                                students.map((s, i) => (
                                    <tr key={i}>
                                        <td>{students.length - i}</td>
                                        <td>{t.deptName}</td>
                                        <td>{s.studentId}</td>
                                        <td style={{fontWeight:'bold'}}>{s.name}</td>
                                        <td>{new Date(s.timestamp.toDate()).toLocaleTimeString()}</td>
                                        <td><span style={styles.attendBadge}>{t.statusOk}</span></td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
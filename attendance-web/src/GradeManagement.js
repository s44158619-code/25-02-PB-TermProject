import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { styles } from "./styles";

export default function GradeManagement({ lang }) {
    const [students, setStudents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: "", studentId: "" });

    const text = {
        ko: {
            title: "학생 성적 관리",
            total: "총",
            addBtn: "+ 학생 추가",
            thNo: "No",
            thId: "학번",
            thName: "이름",
            thA1: "과제1 (20)",
            thA2: "과제2 (20)",
            thTP: "TP (40)",
            thAtt: "출석 (10)",
            thLab: "실습 (10)",
            thTotal: "총점",
            thGrade: "학점",
            modalTitle: "신규 학생 등록",
            phName: "이름 입력",
            phId: "학번 입력",
            cancel: "취소",
            confirm: "등록",
            noData: "등록된 학생이 없습니다.",
            statAvg: "전체 평균",
            statHigh: "최고 점수",
            statLow: "최저 점수",
            statPass: "이수율(C↑)"
        },
        en: {
            title: "Student Grade Management",
            total: "Total",
            addBtn: "+ Add Student",
            thNo: "No",
            thId: "ID",
            thName: "Name",
            thA1: "Assgn1 (20)",
            thA2: "Assgn2 (20)",
            thTP: "TP (40)",
            thAtt: "Attend (10)",
            thLab: "Lab (10)",
            thTotal: "Total",
            thGrade: "Grade",
            modalTitle: "Register New Student",
            phName: "Enter Name",
            phId: "Enter Student ID",
            cancel: "Cancel",
            confirm: "Register",
            noData: "No students registered.",
            statAvg: "Class Avg",
            statHigh: "Highest",
            statLow: "Lowest",
            statPass: "Pass Rate"
        }
    };
    const t = text[lang];

    useEffect(() => {
        const q = query(collection(db, "students"), orderBy("studentId", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(list);
        });
        return () => unsubscribe();
    }, []);

    const handleAddStudent = async () => {
        if (!newStudent.name || !newStudent.studentId) return alert("정보를 모두 입력해주세요.");
        try {
            await addDoc(collection(db, "students"), {
                name: newStudent.name,
                studentId: newStudent.studentId,
                a1: 0, a2: 0, tp: 0, att: 0, lab: 0,
                createdAt: new Date()
            });
            alert("학생이 등록되었습니다.");
            setNewStudent({ name: "", studentId: "" });
            setShowAddModal(false);
        } catch (e) {
            alert("등록 실패");
        }
    };

    const handleGradeUpdate = async (id, field, value) => {
        let val = parseFloat(value);
        if (isNaN(val)) val = 0;
        if (field === 'a1' || field === 'a2') val = Math.min(val, 20);
        if (field === 'tp') val = Math.min(val, 40);
        if (field === 'att' || field === 'lab') val = Math.min(val, 10);

        const studentRef = doc(db, "students", id);
        await updateDoc(studentRef, { [field]: val });
    };

    const calculateGrade = (total) => {
        if (total >= 95) return "A+";
        if (total >= 90) return "A";
        if (total >= 85) return "B+";
        if (total >= 80) return "B";
        if (total >= 75) return "C+";
        if (total >= 70) return "C";
        if (total >= 60) return "D";
        return "F";
    };

    const getStats = () => {
        if (students.length === 0) return { avg: 0, max: 0, min: 0, pass: 0 };
        const totals = students.map(s => (s.a1||0)+(s.a2||0)+(s.tp||0)+(s.att||0)+(s.lab||0));
        const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
        const max = Math.max(...totals);
        const min = Math.min(...totals);
        const passCount = totals.filter(score => score >= 70).length;
        const passRate = (passCount / totals.length) * 100;
        return { avg: avg.toFixed(1), max, min, pass: passRate.toFixed(0) };
    };

    const stats = getStats();

    return (
        <div className="fade-in">
            {/* 성적 분석 위젯 (New) */}
            <div style={styles.gridContainer}>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>{t.statAvg}</div>
                    <div style={{...styles.statValue, color:'#2b6cb0'}}>{stats.avg}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>{t.statHigh}</div>
                    <div style={{...styles.statValue, color:'#48bb78'}}>{stats.max}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>{t.statLow}</div>
                    <div style={{...styles.statValue, color:'#e53e3e'}}>{stats.min}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>{t.statPass}</div>
                    <div style={{...styles.statValue, color:'#805ad5'}}>{stats.pass}%</div>
                </div>
            </div>

            <div style={styles.sectionBox}>
                <div style={styles.sectionTitle}>
                    <span>{t.title} <span style={{fontSize:'14px', color:'#666', fontWeight:'normal'}}>({t.total} {students.length})</span></span>
                    <button onClick={() => setShowAddModal(true)} style={styles.primaryBtn}>{t.addBtn}</button>
                </div>
                <div style={{overflowX:'auto'}}>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th>{t.thNo}</th>
                            <th>{t.thId}</th>
                            <th>{t.thName}</th>
                            <th style={{textAlign:'center'}}>{t.thA1}</th>
                            <th style={{textAlign:'center'}}>{t.thA2}</th>
                            <th style={{textAlign:'center'}}>{t.thTP}</th>
                            <th style={{textAlign:'center'}}>{t.thAtt}</th>
                            <th style={{textAlign:'center'}}>{t.thLab}</th>
                            <th style={{textAlign:'center', color:'#10316b'}}>{t.thTotal}</th>
                            <th style={{textAlign:'center'}}>{t.thGrade}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.length === 0 ? (
                            <tr><td colSpan="10" style={{textAlign:'center', padding:'30px', color:'#999'}}>{t.noData}</td></tr>
                        ) : (
                            students.map((s, i) => {
                                const total = (s.a1||0) + (s.a2||0) + (s.tp||0) + (s.att||0) + (s.lab||0);
                                return (
                                    <tr key={s.id}>
                                        <td>{i + 1}</td>
                                        <td>{s.studentId}</td>
                                        <td style={{fontWeight:'bold'}}>{s.name}</td>
                                        <td style={{textAlign:'center'}}><input style={styles.gradeInput} value={s.a1} onChange={(e) => handleGradeUpdate(s.id, 'a1', e.target.value)} /></td>
                                        <td style={{textAlign:'center'}}><input style={styles.gradeInput} value={s.a2} onChange={(e) => handleGradeUpdate(s.id, 'a2', e.target.value)} /></td>
                                        <td style={{textAlign:'center'}}><input style={styles.gradeInput} value={s.tp} onChange={(e) => handleGradeUpdate(s.id, 'tp', e.target.value)} /></td>
                                        <td style={{textAlign:'center'}}><input style={styles.gradeInput} value={s.att} onChange={(e) => handleGradeUpdate(s.id, 'att', e.target.value)} /></td>
                                        <td style={{textAlign:'center'}}><input style={styles.gradeInput} value={s.lab} onChange={(e) => handleGradeUpdate(s.id, 'lab', e.target.value)} /></td>
                                        <td style={{textAlign:'center', fontWeight:'bold', color:'#10316b'}}>{total}</td>
                                        <td style={{textAlign:'center', fontWeight:'bold'}}>{calculateGrade(total)}</td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>{t.modalTitle}</h3>
                        <div style={{marginBottom:'15px'}}>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>이름</label>
                            <input style={styles.input} value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} placeholder={t.phName} />
                        </div>
                        <div>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>학번</label>
                            <input style={styles.input} value={newStudent.studentId} onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})} placeholder={t.phId} />
                        </div>
                        <div style={styles.modalActions}>
                            <button onClick={() => setShowAddModal(false)} style={styles.secondaryBtn}>{t.cancel}</button>
                            <button onClick={handleAddStudent} style={styles.primaryBtn}>{t.confirm}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
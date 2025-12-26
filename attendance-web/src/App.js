import React, { useState, useEffect } from "react";
import { auth, db, provider } from "./firebase";
import { signInWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";
import { styles, injectGlobalStyles } from "./styles";
import Attendance from "./Attendance";
import NoticeBoard from "./NoticeBoard";
import GradeManagement from "./GradeManagement";
import StudentDashboard from "./StudentDashboard";
import Assignment from "./Assignment";
import WeeklyPlanner from "./WeeklyPlanner";

function App() {
    const [userMode, setUserMode] = useState(null);
    const [loginTab, setLoginTab] = useState("student");

    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [lang, setLang] = useState("ko");
    const [studentsCount, setStudentsCount] = useState(0);
    const [attendCount, setAttendCount] = useState(0);
    const [recentNotices, setRecentNotices] = useState([]);

    const [studentInfo, setStudentInfo] = useState(null);
    const [inputName, setInputName] = useState("");
    const [inputId, setInputId] = useState("");

    const text = {
        ko: {
            sidebarTitle: "JBNU LMS",
            menuDash: "대시보드",
            menuWeek: "주차별 강의 계획",
            menuAttend: "출석 관리",
            menuNotice: "공지사항 관리",
            menuGrade: "학생 성적 관리",
            menuAssign: "과제 제출 관리",
            pageDash: "통합 제어 대시보드",
            pageWeek: "15주차 강의 계획 및 자료실",
            pageAttend: "출석 관리 시스템",
            pageNotice: "공지사항 게시판",
            pageGrade: "성적 평가 및 분석",
            pageAssign: "과제 관리 시스템",
            profName: "이경수 교수",
            logout: "로그아웃",
            statTotal: "총 수강생",
            statAttend: "금일 출석",
            statAssign: "과제 제출",
            statAction: "바로가기",
            statActionDesc: "출석 시작하기 →",
            unitPerson: "명",
            msgLive: "● 실시간 등록 현황",
            msgCheck: "● 실시간 집계 중",
            msgMiss: "● 미제출 확인 필요",
            msgGo: "바로가기",
            secNotice: "최근 게시된 공지",
            viewAll: "전체보기",
            noNotice: "공지 내역 없음",
            secSystem: "시스템 상태",
            dbStatus: "DB 연결 상태",
            dbOk: "정상 (Firestore)",
            semesterLabel: "현재 학기",
            semesterValue: "2025학년도 2학기"
        },
        en: {
            sidebarTitle: "JBNU LMS",
            menuDash: "Dashboard",
            menuWeek: "Weekly Schedule",
            menuAttend: "Attendance",
            menuNotice: "Notice Board",
            menuGrade: "Grade Mgmt",
            menuAssign: "Assignment",
            pageDash: "Control Dashboard",
            pageWeek: "Weekly Resources",
            pageAttend: "Attendance System",
            pageNotice: "Notice Management",
            pageGrade: "Grading Analytics",
            pageAssign: "Assignment System",
            profName: "Prof. Lee",
            logout: "Logout",
            statTotal: "Total Students",
            statAttend: "Attendance Rate",
            statAssign: "Assignments",
            statAction: "Quick Action",
            statActionDesc: "Start Attendance →",
            unitPerson: "",
            msgLive: "● Live Registered",
            msgCheck: "● Live Counting",
            msgMiss: "● Check Missing",
            msgGo: "Go Now",
            secNotice: "Recent Notices",
            viewAll: "View All",
            noNotice: "No recent notices",
            secSystem: "System Status",
            dbStatus: "DB Connection",
            dbOk: "Online (Firestore)",
            semesterLabel: "Current Term",
            semesterValue: "Fall 2025"
        }
    };

    const t = text[lang];

    useEffect(() => {
        injectGlobalStyles();
        const qNotice = query(collection(db, "notices"), orderBy("createdAt", "desc"));
        onSnapshot(qNotice, (snap) => setRecentNotices(snap.docs.slice(0,3).map(d => d.data())));

        const qStudents = query(collection(db, "students"));
        onSnapshot(qStudents, (snap) => setStudentsCount(snap.size));

        const qAttend = query(collection(db, "attendance"));
        onSnapshot(qAttend, (snap) => setAttendCount(snap.size));
    }, []);

    const handleAdminLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, "admin@test.com", "123456");
            setUserMode("admin");
        } catch (e) {
            alert("관리자 로그인 실패: 계정을 확인하세요.");
        }
    };

    const handleStudentLogin = async () => {
        if(!inputName || !inputId) return alert("이름과 학번을 입력하세요.");
        try {
            const q = query(collection(db, "students"), where("studentId", "==", inputId), where("name", "==", inputName));
            const querySnapshot = await getDocs(q);

            if(querySnapshot.empty) {
                alert("등록되지 않은 학생입니다. 관리자에게 문의하세요.");
            } else {
                const studentData = querySnapshot.docs[0].data();
                setStudentInfo(studentData);
                setUserMode("student");
            }
        } catch(e) {
            alert("로그인 중 오류 발생");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setStudentInfo({ name: user.displayName, studentId: "SocialLogin" });
            setUserMode("student");
            alert(`Welcome, ${user.displayName}! (Social Login)`);
        } catch (error) {
            console.error(error);
            alert("Google Login Failed");
        }
    };

    const handleLogout = () => {
        signOut(auth);
        setUserMode(null);
        setStudentInfo(null);
        setInputName("");
        setInputId("");
    };

    const toggleLang = () => {
        setLang(prev => prev === "ko" ? "en" : "ko");
    };

    if (!userMode) {
        return (
            <div style={styles.loginContainer}>
                <div style={styles.loginCard}>
                    <div style={styles.jbnuLogo}>JBNU LMS</div>
                    <div style={styles.loginTitle}>통합 학습관리 시스템</div>

                    <div style={styles.loginSwitch}>
                        <div
                            style={loginTab === "student" ? {...styles.switchBtn, ...styles.switchBtnActive} : styles.switchBtn}
                            onClick={() => setLoginTab("student")}
                        >
                            학생 로그인
                        </div>
                        <div
                            style={loginTab === "admin" ? {...styles.switchBtn, ...styles.switchBtnActive} : styles.switchBtn}
                            onClick={() => setLoginTab("admin")}
                        >
                            관리자 로그인
                        </div>
                    </div>

                    {loginTab === "student" ? (
                        <>
                            <input style={styles.loginInput} placeholder="이름 (예: 홍길동)" value={inputName} onChange={(e) => setInputName(e.target.value)} />
                            <input style={styles.loginInput} placeholder="학번 (예: 20250001)" value={inputId} onChange={(e) => setInputId(e.target.value)} />
                            <button onClick={handleStudentLogin} style={styles.loginButton}>로그인</button>

                            <div style={{marginTop:'15px', borderTop:'1px solid #eee', paddingTop:'15px'}}>
                                <button onClick={handleGoogleLogin} style={{...styles.loginButton, backgroundColor:'white', color:'#333', border:'1px solid #ddd', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
                                    <span style={{fontSize:'18px'}}>G</span> Google 계정으로 로그인
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{padding:'20px 0', fontSize:'14px', color:'#666'}}>교수자 및 관리자 전용입니다.</div>
                            <button onClick={handleAdminLogin} style={styles.loginButton}>관리자 계정으로 접속</button>
                        </>
                    )}

                    <div style={styles.copyright}>© 2025 Jeonbuk National University</div>
                </div>
            </div>
        );
    }

    // [수정] 학생 사이드바에 '주차별 강의 계획' 탭 추가 및 이름 통일
    if (userMode === "student") {
        return (
            <div style={styles.container}>
                <nav style={styles.sidebar}>
                    <div style={styles.sidebarHeader} onClick={() => setActiveMenu('dashboard')}>STUDENT</div>
                    <div style={styles.sidebarMenu}>
                        <div style={activeMenu === 'dashboard' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('dashboard')}>
                            <span style={styles.menuIcon}>📊</span> {t.menuDash}
                        </div>
                        {/* 여기가 핵심 수정: 학생도 t.menuWeek (주차별 강의 계획) 탭을 봅니다 */}
                        <div style={activeMenu === 'weeks' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('weeks')}>
                            <span style={styles.menuIcon}>📅</span> {t.menuWeek}
                        </div>
                        <div style={activeMenu === 'assignment' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('assignment')}>
                            <span style={styles.menuIcon}>📝</span> {t.menuAssign}
                        </div>
                    </div>
                    <div style={styles.sidebarFooter}>Student Mode</div>
                </nav>

                <main style={styles.main}>
                    <header style={styles.header}>
                        <div style={styles.pageTitle}>
                            {activeMenu === 'dashboard' && (lang === 'ko' ? "학생 대시보드" : "Student Dashboard")}
                            {activeMenu === 'weeks' && t.pageWeek}
                            {activeMenu === 'assignment' && (lang === 'ko' ? "과제 제출" : "Assignments")}
                        </div>
                        <div style={styles.headerUser}>
                            <button onClick={toggleLang} style={styles.langBtn}>🌏</button>
                            <span style={{fontWeight:'bold'}}>{studentInfo.name}</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>{t.logout}</button>
                        </div>
                    </header>
                    <div style={styles.contentBody}>
                        {activeMenu === 'dashboard' && <StudentDashboard studentInfo={studentInfo} onLogout={handleLogout} lang={lang} />}
                        {activeMenu === 'weeks' && <WeeklyPlanner userMode="student" lang={lang} />}
                        {activeMenu === 'assignment' && <Assignment userMode="student" studentInfo={studentInfo} lang={lang} />}
                    </div>
                </main>
            </div>
        );
    }

    const renderAdminDashboard = () => (
        <div className="fade-in">
            <div style={styles.gridContainer}>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>{t.statTotal}</div>
                    <div style={styles.statValue}>{studentsCount}<span style={{fontSize:'16px', color:'#a0aec0', fontWeight:'normal'}}>{t.unitPerson}</span></div>
                    <div style={{...styles.statDiff, color:'#48bb78'}}>{t.msgLive}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>{t.statAttend}</div>
                    <div style={styles.statValue}>{attendCount}<span style={{fontSize:'16px', color:'#a0aec0', fontWeight:'normal'}}>{t.unitPerson}</span></div>
                    <div style={{...styles.statDiff, color:'#4299e1'}}>{t.msgCheck}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>{t.statAssign}</div>
                    <div style={styles.statValue}>0<span style={{fontSize:'16px', color:'#a0aec0', fontWeight:'normal'}}>/{studentsCount}</span></div>
                    <div style={{...styles.statDiff, color:'#ed8936'}}>{t.msgMiss}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>{t.statAction}</div>
                    <div style={styles.statValue} style={{cursor:'pointer', color:'#10316b', fontWeight:'bold', fontSize:'24px'}} onClick={() => setActiveMenu('attendance')}>{t.statActionDesc}</div>
                    <div style={{...styles.statDiff, color:'#10316b'}}>{t.msgGo}</div>
                </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'30px'}}>
                <div style={styles.sectionBox}>
                    <div style={styles.sectionTitle}>
                        {t.secNotice}
                        <span style={{fontSize:'12px', color:'#10316b', cursor:'pointer'}} onClick={() => setActiveMenu('notice')}>{t.viewAll}</span>
                    </div>
                    <table style={styles.table}>
                        <tbody>
                        {recentNotices.map((n, i) => (
                            <tr key={i}>
                                <td style={{width:'70%'}}>{n.title}</td>
                                <td style={{textAlign:'right', color:'#a0aec0', fontSize:'12px'}}>{n.date}</td>
                            </tr>
                        ))}
                        {recentNotices.length === 0 && <tr><td colSpan="2" style={{textAlign:'center', padding:'20px', color:'#cbd5e0'}}>{t.noNotice}</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div style={styles.sectionBox}>
                    <div style={styles.sectionTitle}>{t.secSystem}</div>
                    <div style={{marginBottom:'15px'}}>
                        <div style={{fontSize:'13px', color:'#718096', marginBottom:'5px'}}>{t.dbStatus}</div>
                        <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#48bb78', fontWeight:'bold', fontSize:'14px'}}>
                            <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#48bb78'}}></div> {t.dbOk}
                        </div>
                    </div>
                    <div>
                        <div style={{fontSize:'13px', color:'#718096', marginBottom:'5px'}}>{t.semesterLabel}</div>
                        <div style={{fontWeight:'bold', color:'#2d3748'}}>{t.semesterValue}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <nav style={styles.sidebar}>
                <div style={styles.sidebarHeader} onClick={() => setActiveMenu('dashboard')}>{t.sidebarTitle}</div>
                <div style={styles.sidebarMenu}>
                    <div style={activeMenu === 'dashboard' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('dashboard')}>
                        <span style={styles.menuIcon}>📊</span> {t.menuDash}
                    </div>
                    <div style={activeMenu === 'weeks' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('weeks')}>
                        <span style={styles.menuIcon}>📅</span> {t.menuWeek}
                    </div>
                    <div style={activeMenu === 'attendance' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('attendance')}>
                        <span style={styles.menuIcon}>✅</span> {t.menuAttend}
                    </div>
                    <div style={activeMenu === 'grade' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('grade')}>
                        <span style={styles.menuIcon}>🎓</span> {t.menuGrade}
                    </div>
                    <div style={activeMenu === 'notice' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('notice')}>
                        <span style={styles.menuIcon}>📢</span> {t.menuNotice}
                    </div>
                    <div style={activeMenu === 'assignment' ? {...styles.menuItem, ...styles.menuItemActive} : styles.menuItem} onClick={() => setActiveMenu('assignment')}>
                        <span style={styles.menuIcon}>📁</span> {t.menuAssign}
                    </div>
                </div>
                <div style={styles.sidebarFooter}>Ver 8.0.0 ({lang.toUpperCase()})</div>
            </nav>

            <main style={styles.main}>
                <header style={styles.header}>
                    <div style={styles.pageTitle}>
                        {activeMenu === 'dashboard' && t.pageDash}
                        {activeMenu === 'weeks' && t.pageWeek}
                        {activeMenu === 'attendance' && t.pageAttend}
                        {activeMenu === 'notice' && t.pageNotice}
                        {activeMenu === 'grade' && t.pageGrade}
                        {activeMenu === 'assignment' && t.pageAssign}
                    </div>
                    <div style={styles.headerUser}>
                        <button onClick={toggleLang} style={styles.langBtn}>🌏</button>
                        <span style={{fontWeight:'600'}}>{t.profName}</span>
                        <span style={{color:'#cbd5e0'}}>|</span>
                        <button onClick={handleLogout} style={styles.logoutBtn}>{t.logout}</button>
                    </div>
                </header>

                <div style={styles.contentBody}>
                    {activeMenu === 'dashboard' && renderAdminDashboard()}
                    {activeMenu === 'weeks' && <WeeklyPlanner userMode="admin" lang={lang} />}
                    {activeMenu === 'attendance' && <Attendance lang={lang} />}
                    {activeMenu === 'grade' && <GradeManagement lang={lang} />}
                    {activeMenu === 'notice' && <NoticeBoard lang={lang} />}
                    {activeMenu === 'assignment' && <Assignment userMode="admin" lang={lang} />}
                </div>
            </main>
        </div>
    );
}

export default App;
export const styles = {
    loginContainer: { height: "100vh", backgroundColor: "#eef2f5", display: "flex", justifyContent: "center", alignItems: "center" },
    loginCard: { backgroundColor: "white", width: "420px", padding: "50px 40px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", textAlign: "center", borderTop: "5px solid #10316b" },
    jbnuLogo: { fontSize: "36px", fontWeight: "900", color: "#10316b", letterSpacing: "-1px", marginBottom: "10px" },
    loginTitle: { fontSize: "20px", fontWeight: "bold", color: "#333", marginBottom: "30px" },

    loginSwitch: { display: "flex", marginBottom: "30px", borderBottom: "2px solid #eee" },
    switchBtn: { flex: 1, padding: "10px", cursor: "pointer", fontWeight: "bold", color: "#aaa", borderBottom: "2px solid transparent", transition: "0.3s" },
    switchBtnActive: { color: "#10316b", borderBottom: "2px solid #10316b" },

    loginInput: { width: "100%", padding: "14px", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "12px", fontSize: "14px", boxSizing: "border-box" },
    loginButton: { width: "100%", padding: "16px", backgroundColor: "#10316b", color: "white", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" },
    copyright: { fontSize: "12px", color: "#999", marginTop: "40px" },

    container: { display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: "'Pretendard', sans-serif" },
    sidebar: { width: "260px", backgroundColor: "#1a202e", color: "white", display: "flex", flexDirection: "column", flexShrink: 0 },
    sidebarHeader: { height: "70px", display: "flex", alignItems: "center", paddingLeft: "25px", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "22px", fontWeight: "900", letterSpacing: "-1px", cursor: "pointer" },
    sidebarMenu: { padding: "20px 0", flex: 1 },
    menuItem: { padding: "15px 25px", fontSize: "15px", color: "#a0aec0", cursor: "pointer", display: "flex", alignItems: "center", transition: "0.2s" },
    menuItemActive: { backgroundColor: "#10316b", color: "white", borderRight: "4px solid #4fd1c5", fontWeight: "600" },
    menuIcon: { marginRight: "12px", width: "20px", textAlign: "center" },
    sidebarFooter: { padding: "20px", fontSize: "12px", color: "#718096", borderTop: "1px solid rgba(255,255,255,0.1)" },

    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    header: { height: "70px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 30px" },
    pageTitle: { fontSize: "18px", fontWeight: "bold", color: "#2d3748" },
    headerUser: { display: "flex", alignItems: "center", gap: "15px", fontSize: "14px", color: "#4a5568" },
    langBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "20px", padding: "5px", display: "flex", alignItems: "center", justifyContent: "center" },
    logoutBtn: { padding: "6px 12px", border: "1px solid #cbd5e0", borderRadius: "4px", background: "white", cursor: "pointer", fontSize: "12px" },
    contentBody: { padding: "30px", overflowY: "auto", height: "calc(100vh - 70px)" },

    gridContainer: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "25px", marginBottom: "30px" },
    statCard: { backgroundColor: "white", padding: "25px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", transition: "transform 0.2s", cursor: "default" },
    statLabel: { fontSize: "13px", color: "#718096", fontWeight: "600", marginBottom: "10px", textTransform: "uppercase" },
    statValue: { fontSize: "32px", fontWeight: "800", color: "#2d3748" },
    statDiff: { fontSize: "13px", marginTop: "5px", display: "flex", alignItems: "center", gap: "5px" },
    sectionBox: { backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "25px", marginBottom: "30px" },
    sectionTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "20px", color: "#2d3748", display: "flex", justifyContent: "space-between", alignItems: "center" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },

    formContainer: { backgroundColor: "white", padding: "30px", borderRadius: "8px", border: "1px solid #e2e8f0" },
    input: { width: "100%", padding: "12px", border: "1px solid #cbd5e0", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" },
    textarea: { width: "100%", padding: "12px", border: "1px solid #cbd5e0", borderRadius: "6px", minHeight: "150px", resize: "vertical", fontSize: "14px", fontFamily: "inherit" },
    primaryBtn: { backgroundColor: "#10316b", color: "white", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" },
    secondaryBtn: { backgroundColor: "#edf2f7", color: "#4a5568", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: "10px" },

    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 },
    modalContent: { background: "white", width: "500px", borderRadius: "8px", padding: "30px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
    attendanceContainer: { display: "grid", gridTemplateColumns: "350px 1fr", gap: "30px", alignItems: "start", height: "calc(100vh - 200px)" },
    controlPanel: { backgroundColor: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e1e4e8", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    subTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "20px", color: "#343a40" },
    startBox: { padding: "20px 0" },
    primaryBtnLarge: { width: "100%", padding: "15px", backgroundColor: "#10316b", color: "white", fontSize: "18px", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer" },
    activeBox: { animation: "pulseBox 2s infinite" },
    activeLabel: { fontSize: "14px", color: "#868e96", marginBottom: "10px" },
    codeDisplay: { fontSize: "64px", fontWeight: "900", color: "#10316b", letterSpacing: "8px", margin: "10px 0", fontFamily: "monospace" },
    pulseBadge: { display: "inline-block", backgroundColor: "#e7f5ff", color: "#1864ab", padding: "5px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" },
    listPanel: { backgroundColor: "white", borderRadius: "12px", border: "1px solid #e1e4e8", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" },
    listHeader: { padding: "20px", borderBottom: "1px solid #e1e4e8", display: "flex", justifyContent: "space-between", alignItems: "center" },
    countBadge: { fontSize: "14px", fontWeight: "bold", color: "#10316b" },
    studentListWrapper: { overflowY: "auto", flex: 1 },
    attendBadge: { backgroundColor: "#e6fcf5", color: "#0ca678", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" },
    gradeInput: { width: "50px", padding: "5px", border: "1px solid #ddd", borderRadius: "4px", textAlign: "center" },
    weekCard: { backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    uploadBtn: { padding: "6px 12px", backgroundColor: "#fff", border: "1px solid #10316b", color: "#10316b", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
    modalTitle: { margin: "0 0 20px 0", fontSize: "20px", fontWeight: "bold", color: "#2d3748" },
    modalActions: { marginTop: "25px", display: "flex", justifyContent: "flex-end" },
    studentAttendBox: { backgroundColor: "#e8f0fe", padding: "20px", borderRadius: "8px", border: "1px solid #d0e1fd", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    attendInput: { fontSize: "20px", padding: "10px", width: "150px", textAlign: "center", border: "2px solid #10316b", borderRadius: "6px", marginRight: "15px", fontWeight: "bold" },
    attendBtn: { backgroundColor: "#10316b", color: "white", padding: "12px 24px", borderRadius: "6px", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },
    assignmentCard: { backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "25px", marginBottom: "20px" },
    fileInput: { display: "none" },
    fileLabel: { padding: "8px 16px", backgroundColor: "#4a5568", color: "white", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", display: "inline-block", marginRight: "10px" },
    downloadLink: { color: "#10316b", textDecoration: "none", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" },

    skeleton: { backgroundColor: "#e2e8f0", borderRadius: "4px", animation: "skeletonLoading 1.5s infinite" },
    progressBarContainer: { width: "100%", backgroundColor: "#edf2f7", borderRadius: "10px", height: "10px", overflow: "hidden", marginTop: "10px" },
    progressBarValue: { height: "100%", backgroundColor: "#48bb78", transition: "width 0.5s ease-in-out" },

    alertCard: { backgroundColor: "#fff5f5", borderLeft: "4px solid #e53e3e", padding: "15px", marginBottom: "20px", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" },
};

export const injectGlobalStyles = () => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
    body { margin: 0; font-family: 'Pretendard', sans-serif; background-color: #f5f7fa; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-thumb { background: #cbd5e0; borderRadius: 4px; }
    th { text-align: left; padding: 15px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 13px; text-transform: uppercase; }
    td { padding: 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; }
    tr:hover td { background-color: #f7fafc; cursor: pointer; }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulseBox { 0% { box-shadow: 0 0 0 0 rgba(16, 49, 107, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 49, 107, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 49, 107, 0); } }
    @keyframes skeletonLoading { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
    .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; transition: 0.3s; }
  `;
    document.head.appendChild(styleSheet);
};
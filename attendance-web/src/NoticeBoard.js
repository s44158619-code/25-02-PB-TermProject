import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { styles } from "./styles";

export default function NoticeBoard({ lang }) {
    const [notices, setNotices] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: "", content: "" });
    const [viewModal, setViewModal] = useState(null);

    const text = {
        ko: {
            listTitle: "공지사항 목록",
            addBtn: "+ 공지 등록",
            formTitle: "새 공지사항 작성",
            phTitle: "제목을 입력하세요",
            phContent: "공지 내용을 입력하세요",
            cancel: "취소",
            submit: "등록하기",
            tableNo: "No",
            tableTitle: "제목",
            tableAuthor: "작성자",
            tableDate: "작성일",
            tableManage: "관리",
            delete: "삭제",
            noData: "등록된 공지가 없습니다.",
            close: "닫기",
            alertEmpty: "내용을 입력해주세요.",
            alertDone: "공지사항이 등록되었습니다.",
            confirmDelete: "정말 이 공지사항을 삭제하시겠습니까?",
            authorName: "이경수 교수"
        },
        en: {
            listTitle: "Notice List",
            addBtn: "+ New Post",
            formTitle: "Create New Notice",
            phTitle: "Enter title",
            phContent: "Enter content",
            cancel: "Cancel",
            submit: "Submit",
            tableNo: "No",
            tableTitle: "Title",
            tableAuthor: "Author",
            tableDate: "Date",
            tableManage: "Actions",
            delete: "Delete",
            noData: "No notices found.",
            close: "Close",
            alertEmpty: "Please enter content.",
            alertDone: "Notice has been posted.",
            confirmDelete: "Are you sure you want to delete this notice?",
            authorName: "Prof. Lee"
        }
    };

    const t = text[lang];

    useEffect(() => {
        const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotices(list);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async () => {
        if (!newNotice.title || !newNotice.content) return alert(t.alertEmpty);
        try {
            await addDoc(collection(db, "notices"), {
                title: newNotice.title,
                content: newNotice.content,
                author: t.authorName,
                date: new Date().toLocaleDateString(),
                createdAt: new Date()
            });
            alert(t.alertDone);
            setIsWriting(false);
            setNewNotice({ title: "", content: "" });
        } catch (e) {
            alert("Error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t.confirmDelete)) await deleteDoc(doc(db, "notices", id));
    };

    return (
        <div className="fade-in">
            {isWriting ? (
                <div style={styles.formContainer}>
                    <h3 style={{marginBottom:'20px', color:'#2d3748'}}>{t.formTitle}</h3>
                    <input style={styles.input} placeholder={t.phTitle} value={newNotice.title} onChange={(e) => setNewNotice({...newNotice, title: e.target.value})} />
                    <textarea style={styles.textarea} placeholder={t.phContent} value={newNotice.content} onChange={(e) => setNewNotice({...newNotice, content: e.target.value})} />
                    <div style={{textAlign:'right'}}>
                        <button onClick={() => setIsWriting(false)} style={styles.secondaryBtn}>{t.cancel}</button>
                        <button onClick={handleSubmit} style={styles.primaryBtn}>{t.submit}</button>
                    </div>
                </div>
            ) : (
                <div style={styles.sectionBox}>
                    <div style={styles.sectionTitle}>
                        {t.listTitle}
                        <button onClick={() => setIsWriting(true)} style={styles.primaryBtn}>{t.addBtn}</button>
                    </div>
                    <table style={styles.table}>
                        <thead><tr><th>{t.tableNo}</th><th>{t.tableTitle}</th><th>{t.tableAuthor}</th><th>{t.tableDate}</th><th>{t.tableManage}</th></tr></thead>
                        <tbody>
                        {notices.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'#a0aec0'}}>{t.noData}</td></tr> :
                            notices.map((n, i) => (
                                <tr key={n.id} onClick={() => setViewModal(n)}>
                                    <td>{notices.length - i}</td>
                                    <td style={{fontWeight:'600'}}>{n.title}</td>
                                    <td>{n.author}</td>
                                    <td>{n.date}</td>
                                    <td><button onClick={(e) => {e.stopPropagation(); handleDelete(n.id)}} style={{color:'#e53e3e', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}}>{t.delete}</button></td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            )}

            {viewModal && (
                <div style={styles.modalOverlay} onClick={() => setViewModal(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{marginTop:0, color:'#2d3748'}}>{viewModal.title}</h3>
                        <div style={{fontSize:'13px', color:'#718096', marginBottom:'20px', borderBottom:'1px solid #edf2f7', paddingBottom:'10px'}}>
                            {t.tableDate}: {viewModal.date} | {t.tableAuthor}: {viewModal.author}
                        </div>
                        <p style={{whiteSpace:'pre-line', color:'#4a5568', lineHeight:'1.6'}}>{viewModal.content}</p>
                        <div style={{textAlign:'right', marginTop:'20px'}}>
                            <button onClick={() => setViewModal(null)} style={styles.primaryBtn}>{t.close}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
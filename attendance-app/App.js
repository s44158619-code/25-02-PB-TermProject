import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { db } from './firebase'; // firebase.js 경로 확인
import { collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';

const Stack = createNativeStackNavigator();

// 1. 로그인 화면
function LoginScreen({ navigation }) {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');

    const handleLogin = async () => {
        if (!name || !studentId) return Alert.alert("알림", "이름과 학번을 입력하세요.");

        try {
            // 웹과 똑같은 'students' 컬렉션에서 학생 찾기
            const q = query(collection(db, "students"), where("studentId", "==", studentId), where("name", "==", name));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                Alert.alert("오류", "등록되지 않은 학생입니다. (웹에서 먼저 확인해보세요)");
            } else {
                const studentData = querySnapshot.docs[0].data();
                // 대시보드로 이동하면서 학생 정보 넘기기
                navigation.replace('Dashboard', { studentInfo: studentData });
            }
        } catch (e) {
            console.error(e);
            Alert.alert("오류", "로그인 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>JBNU LMS</Text>
            <Text style={styles.subLogo}>모바일 출석 앱</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="이름 (예: 홍길동)"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="학번 (예: 20250001)"
                    value={studentId}
                    onChangeText={setStudentId}
                    keyboardType="number-pad"
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// 2. 학생 대시보드 (출석체크 기능)
function DashboardScreen({ route, navigation }) {
    const { studentInfo } = route.params;
    const [code, setCode] = useState('');
    const [myAttendance, setMyAttendance] = useState([]);

    useEffect(() => {
        // 실시간 출석 기록 가져오기 (웹과 데이터 연동됨!)
        const q = query(collection(db, "attendance"), where("studentId", "==", studentInfo.studentId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => doc.data());
            // 최신순 정렬
            list.sort((a, b) => b.timestamp - a.timestamp);
            setMyAttendance(list);
        });
        return () => unsubscribe();
    }, []);

    const handleAttendance = async () => {
        if (!code) return Alert.alert("알림", "인증번호 4자리를 입력하세요.");

        try {
            // 1. 세션 확인
            const qSession = query(collection(db, "sessions"), where("code", "==", code), where("isOpen", "==", true));
            const sessionSnap = await getDocs(qSession);

            if (sessionSnap.empty) {
                Alert.alert("실패", "유효하지 않은 코드거나 출석 시간이 아닙니다.");
                return;
            }

            // 2. 중복 체크
            if (myAttendance.some(att => att.code === code)) {
                Alert.alert("알림", "이미 출석했습니다.");
                return;
            }

            // 3. 출석 기록 저장
            await addDoc(collection(db, "attendance"), {
                studentId: studentInfo.studentId,
                name: studentInfo.name,
                code: code,
                timestamp: new Date()
            });

            Alert.alert("성공", "출석체크가 완료되었습니다!");
            setCode('');
        } catch (e) {
            Alert.alert("오류", "출석 처리 실패");
        }
    };

    return (
        <View style={styles.dashboardContainer}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>안녕하세요, {studentInfo.name}님</Text>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                    <Text style={styles.logoutText}>로그아웃</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>📢 실시간 출석체크</Text>
                <TextInput
                    style={styles.codeInput}
                    placeholder="인증번호 4자리"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={4}
                />
                <TouchableOpacity style={styles.attendButton} onPress={handleAttendance}>
                    <Text style={styles.buttonText}>출석하기</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>나의 출석 기록 ({myAttendance.length}회)</Text>
            <ScrollView style={styles.listArea}>
                {myAttendance.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                        <Text style={styles.dateText}>{new Date(item.timestamp.toDate()).toLocaleString()}</Text>
                        <Text style={styles.statusBadge}>출석완료</Text>
                    </View>
                ))}
                {myAttendance.length === 0 && <Text style={styles.emptyText}>기록이 없습니다.</Text>}
            </ScrollView>
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#10316b', justifyContent: 'center', alignItems: 'center', padding: 20 },
    logo: { fontSize: 40, fontWeight: '900', color: 'white', marginBottom: 10 },
    subLogo: { fontSize: 20, color: '#a0aec0', marginBottom: 50 },
    inputContainer: { width: '100%', backgroundColor: 'white', padding: 30, borderRadius: 15 },
    input: { backgroundColor: '#f7fafc', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
    button: { backgroundColor: '#10316b', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    dashboardContainer: { flex: 1, backgroundColor: '#f5f7fa', paddingTop: 60, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#2d3748' },
    logoutText: { color: '#718096', fontSize: 14 },
    card: { backgroundColor: 'white', padding: 25, borderRadius: 15, marginBottom: 30, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#10316b', marginBottom: 15 },
    codeInput: { fontSize: 24, textAlign: 'center', letterSpacing: 5, borderWidth: 2, borderColor: '#10316b', borderRadius: 10, padding: 15, marginBottom: 15 },
    attendButton: { backgroundColor: '#10316b', padding: 15, borderRadius: 10, alignItems: 'center' },

    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#4a5568', marginBottom: 15 },
    listArea: { flex: 1 },
    listItem: { backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateText: { fontSize: 15, color: '#2d3748' },
    statusBadge: { color: '#0ca678', fontWeight: 'bold', backgroundColor: '#e6fcf5', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
    emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 20 }
});
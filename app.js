// นำเข้า Firebase modules ผ่าน CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ใส่ Firebase Config ของคุณ
const firebaseConfig = {
    apiKey: "AIzaSyC-ydVqEPgmrcnmxvF5qzOdoVATc_fDIz0",
    authDomain: "kaptanapp-d0bc5.firebaseapp.com",
    projectId: "kaptanapp-d0bc5",
    storageBucket: "kaptanapp-d0bc5.firebasestorage.app",
    messagingSenderId: "1028598429245",
    appId: "1:1028598429245:web:789268cca2c7099f479c54",
    measurementId: "G-VQWTBVZGXJ"
};

// เริ่มต้นใช้งาน Firebase และ Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ฟังก์ชันคำนวณและจัดการการ Submit ฟอร์ม
document.getElementById('ncdForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ

    // ดึงค่าจากฟอร์ม
    const name = document.getElementById('name').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const smoking = document.getElementById('smoking').value;

    // คำนวณ BMI
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    
    // ประเมินความเสี่ยงเบื้องต้น (ตรรกะแบบง่าย)
    let riskLevel = "ปกติ";
    if (bmi >= 25 || smoking === 'yes') {
        riskLevel = "มีความเสี่ยงปานกลาง (ควรเริ่มดูแลสุขภาพ)";
    }
    if (bmi >= 30 && smoking === 'yes') {
        riskLevel = "มีความเสี่ยงสูง (ควรปรึกษาแพทย์)";
    }

    // แสดงผลบนหน้าเว็บ
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    resultDiv.classList.remove('hidden');
    resultText.innerHTML = `BMI ของคุณคือ ${bmi.toFixed(2)}<br>ระดับความเสี่ยง NCDs: ${riskLevel}`;

    // บันทึกข้อมูลลง Firebase Firestore
    try {
        const docRef = await addDoc(collection(db, "ncd_predictions"), {
            name: name,
            weight: weight,
            height: heightCm,
            bmi: bmi.toFixed(2),
            smoking: smoking,
            riskLevel: riskLevel,
            timestamp: serverTimestamp() // บันทึกเวลาปัจจุบัน
        });
        console.log("บันทึกข้อมูลสำเร็จ! ID Document: ", docRef.id);
        alert("บันทึกข้อมูลลงระบบเรียบร้อยแล้ว!");
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล: ", error);
        alert("ไม่สามารถบันทึกข้อมูลได้ โปรดตรวจสอบ Console");
    }
});

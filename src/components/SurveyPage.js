import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./SurveyPage.css";

export default function SimpleSurveyPage({ userID }) {
  const questions = [
    "당신이 가장 자주 사용하는 앱은 무엇인가요?",
    "최근 일주일 간 하루 평균 스마트폰 사용 시간은 얼마인가요?",
    "디지털 기기가 당신의 일상에 어떤 영향을 주고 있나요?"
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.some((ans) => !ans.trim())) {
      alert("모든 질문에 답변을 입력해주세요.");
      return;
    }

    await addDoc(collection(db, "SurveyResponsescase1"), {
      userID,
      responses: questions.map((q, i) => ({
        question: q,
        answer: answers[i],
      })),
      timestamp: new Date(),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="survey-container">
        <header className="survey-header">
          <h1>2025 Survey</h1>
          <p>@Ewha HCIL Lab</p>
        </header>
        <hr />
        <section className="survey-section">
          <h2>모든 질문에 답변해주셔서 감사합니다!</h2>
          <p>설문이 성공적으로 제출되었습니다.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="survey-container">
      <header className="survey-header">
        <h1>2025 Survey</h1>
        <p>@Ewha HCIL Lab</p>
      </header>
      <hr />

      <section className="survey-section">
        <h2>질문에 대한 답변을 입력하고 제출 버튼을 눌러주세요.</h2>

        {questions.map((q, i) => (
          <div className="question-block" key={i}>
            <label>Q{i + 1}. {q}</label>
            <textarea
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="여기에 입력하세요..."
            />
          </div>
        ))}

        <button className="submit-button" onClick={handleSubmit}>
          제출
        </button>
      </section>
    </div>
  );
}

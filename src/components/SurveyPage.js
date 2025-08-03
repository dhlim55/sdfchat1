import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./SurveyPage.css";
import { doc, setDoc } from "firebase/firestore";

export default function SimpleSurveyPage({ userID }) {
  const questions = [
    "오늘날 인터넷이 직면한 가장 중요하고 가장 심각한 문제는 무엇이라고 생각하시며, 그 이유는 무엇인가요?",
    "여행 중 스마트폰을 어떤 방식으로 활용하시나요? 구체적인 예시나 유용한 기능이 있다면 함께 말씀해주세요.",
    "현재 우리가 직면한 환경 문제의 주요 원인은 무엇이라고 생각하시나요? 그러한 원인이 발생하게 된 배경이나 사회적 요인에는 어떤 것들이 있다고 보시나요?",
    "인공지능의 발전이 사회에 미치는 영향에 대해 어떻게 평가하시나요? 긍정적인 점과 우려되는 점이 있다면 무엇인가요?",
    "친환경 에너지가 미래의 주요 에너지원이 될 수 있다고 보십니까? 그에 따른 장점과 단점은 무엇이라고 생각하시나요?"
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [charCounts, setCharCounts] = useState(Array(questions.length).fill(0));


  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  
    const updatedCharCounts = [...charCounts];
    updatedCharCounts[index] = value.length;
    setCharCounts(updatedCharCounts);
  };
  

  const handleSubmit = async () => {
    if (answers.some((ans) => !ans.trim())) {
      alert("모든 질문에 답변을 입력해주세요.");
      return;
    }

    const docID = `user${userID}`;

    await setDoc(doc(db, "SurveyResponsescase1",docID), {
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
          <p>아래 링크로 접속해 폼을 작성해주시면, 소정의 기프티콘이 지급됩니다!</p>
          <p><a href="https://forms.gle/FwNUCTzx3kFQYqEj6" target="_blank">https://forms.gle/FwNUCTzx3kFQYqEj6</a></p>
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
          <div className="char-count">{charCounts[i]}자/300자</div> {/* 글자 수 표시 */}
        </div>
        
        ))}

        <button className="submit-button" onClick={handleSubmit}>
          제출
        </button>
      </section>
    </div>
  );
}

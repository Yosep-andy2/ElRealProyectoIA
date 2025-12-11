import { useState } from 'react';
import { GraduationCap, CheckCircle2, XCircle, AlertCircle, Loader2, ArrowRight, RotateCcw } from 'lucide-react';
import { documentService } from '../../services/documentService';

const Quiz = ({ documentId }) => {
    const [status, setStatus] = useState('intro'); // intro, loading, active, results
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);

    const startQuiz = async () => {
        setStatus('loading');
        setError(null);
        try {
            const data = await documentService.generateQuiz(documentId);
            if (data && data.length > 0) {
                setQuestions(data);
                setStatus('active');
                setCurrentQuestion(0);
                setAnswers({});
            } else {
                setError("No se pudieron generar preguntas. Intenta de nuevo.");
                setStatus('intro');
            }
        } catch (err) {
            console.error(err);
            setError("Error al generar el examen. Verifica tu conexión.");
            setStatus('intro');
        }
    };

    const handleAnswer = (optionIndex) => {
        setAnswers({
            ...answers,
            [currentQuestion]: optionIndex
        });
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateScore();
        }
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correct_answer) {
                correct++;
            }
        });
        setScore(correct);
        setStatus('results');
    };

    const resetQuiz = () => {
        setStatus('intro');
        setQuestions([]);
        setAnswers({});
        setScore(0);
    };

    if (status === 'intro') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                        Examen de Certificación
                    </h3>
                </div>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Ponte a prueba</h4>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Genera automáticamente un examen tipo IBM de 10 preguntas para validar tus conocimientos sobre este documento.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={startQuiz}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Comenzar Examen
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6 p-12 text-center">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900">Preparando tu examen...</h4>
                <p className="text-gray-500">Analizando el documento y redactando preguntas.</p>
            </div>
        );
    }

    if (status === 'active') {
        const question = questions[currentQuestion];
        const isSelected = answers[currentQuestion] !== undefined;

        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <span className="text-sm font-medium text-gray-500">
                        Pregunta {currentQuestion + 1} de {questions.length}
                    </span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-6">{question.question}</h4>

                    <div className="space-y-3 mb-8">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className={`w-full text-left p-4 rounded-lg border transition-all ${answers[currentQuestion] === index
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[currentQuestion] === index
                                            ? 'border-indigo-600'
                                            : 'border-gray-400'
                                        }`}>
                                        {answers[currentQuestion] === index && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                        )}
                                    </div>
                                    <span>{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={nextQuestion}
                            disabled={!isSelected}
                            className={`inline-flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${isSelected
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'results') {
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
                <div className="p-6 bg-indigo-600 text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">Resultados del Examen</h3>
                    <div className="text-6xl font-black mb-2">{percentage}%</div>
                    <p className="opacity-90">Has acertado {score} de {questions.length} preguntas</p>
                </div>

                <div className="p-6 space-y-8">
                    {questions.map((q, qIndex) => {
                        const userAnswer = answers[qIndex];
                        const isCorrect = userAnswer === q.correct_answer;

                        return (
                            <div key={qIndex} className="border-b last:border-0 border-gray-100 pb-6 last:pb-0">
                                <div className="flex items-start gap-3 mb-3">
                                    {isCorrect ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <h4 className="font-medium text-gray-900">{q.question}</h4>
                                    </div>
                                </div>

                                <div className="ml-9 space-y-2">
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">Tu respuesta: </span>
                                        <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                            {q.options[userAnswer]}
                                        </span>
                                    </div>

                                    {!isCorrect && (
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-500">Respuesta correcta: </span>
                                            <span className="text-green-600">{q.options[q.correct_answer]}</span>
                                        </div>
                                    )}

                                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-600 border-l-4 border-indigo-200">
                                        <span className="font-semibold block mb-1">Explicación:</span>
                                        {q.explanation}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="pt-6 flex justify-center">
                        <button
                            onClick={resetQuiz}
                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default Quiz;

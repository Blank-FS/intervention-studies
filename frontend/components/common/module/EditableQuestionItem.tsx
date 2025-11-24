import QuestionDeleteForm from "@/components/researcher/actions/QuestionDeleteForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/types/definition";

const EditableQuestionItem = ({
  q,
  idx,
  onDeleted,
}: {
  q: Question;
  idx: number;
  onDeleted: (id: number) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {idx + 1}. {q.questionText}
          </span>
          <div className="flex gap-4 items-center">
            <Badge variant="default">Question ID: {q.id}</Badge>
            <QuestionDeleteForm questionId={q.id} onDeleted={onDeleted} />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {q.options.map((option) => (
            <li
              key={option.id}
              className={`flex items-center justify-between gap-2 p-2 rounded-md bg-muted ${
                option.id === q.correctOptionId && "border border-green-400"
              }`}
            >
              <span>{option.text}</span>
              <Badge variant="outline">Option ID: {option.id}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EditableQuestionItem;

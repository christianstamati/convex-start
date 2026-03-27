import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list))

  const { mutate: createTask } = useMutation({
    mutationFn: useConvexMutation(api.tasks.create),
  })
  const { mutate: updateTask } = useMutation({
    mutationFn: useConvexMutation(api.tasks.update),
  })
  const { mutate: removeTask } = useMutation({
    mutationFn: useConvexMutation(api.tasks.remove),
  })

  const [draft, setDraft] = useState("")

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    void createTask({ text })
    setDraft("")
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              className="flex-1"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="New task"
              aria-label="New task"
            />
            <Button type="submit">Add</Button>
          </form>
          <ul className="space-y-2">
            {tasks?.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdate={(payload) => updateTask({ id: task._id, payload })}
                onRemove={() => removeTask({ id: task._id })}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function TaskItem({
  task,
  onUpdate,
  onRemove,
}: {
  task: Doc<"tasks">
  onUpdate: (payload: { text?: string; isCompleted?: boolean }) => void
  onRemove: () => void
}) {
  return (
    <li className="flex items-center gap-2">
      <Checkbox
        checked={task.isCompleted}
        onCheckedChange={(checked) =>
          onUpdate({ isCompleted: checked === true })
        }
        aria-label="Completed"
      />
      <Input
        className={cn(
          "min-w-0 flex-1",
          task.isCompleted && "line-through opacity-70"
        )}
        defaultValue={task.text}
        onBlur={(e) => {
          const next = e.target.value.trim()
          if (!next || next === task.text) return
          onUpdate({ text: next })
        }}
      />
      <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
        Delete
      </Button>
    </li>
  )
}

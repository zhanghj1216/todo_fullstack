// 内存存储 - 初始预置2条数据
let todos = [
  { id: 1, text: "学习 Next.js App Router", completed: false },
  { id: 2, text: "创建全栈待办应用", completed: false },
];

// GET: 返回全部待办数组
export async function GET() {
  return Response.json(todos);
}

// POST: 接收 {text: "事项内容"}，添加新待办，返回创建的对象
export async function POST(request: Request) {
  const body = await request.json();

  if (!body.text || typeof body.text !== 'string') {
    return Response.json({ error: 'text is required' }, { status: 400 });
  }

  const newTodo = {
    id: Date.now(),
    text: body.text,
    completed: false,
  };

  todos.push(newTodo);
  return Response.json(newTodo, { status: 201 });
}

// DELETE: 接收 {id: number}，删除对应待办，返回 {success: true}
export async function DELETE(request: Request) {
  const body = await request.json();

  if (!body.id || typeof body.id !== 'number') {
    return Response.json({ error: 'id is required and must be a number' }, { status: 400 });
  }

  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== body.id);

  if (todos.length === initialLength) {
    return Response.json({ error: 'Todo not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}

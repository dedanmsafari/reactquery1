import reactqueryLogo from "/reactquery.svg";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import "./App.css";

//? We are using the fake rest api (https://jsonplaceholder.typicode.com/posts) to POST data

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const fetchTodos = async (): Promise<Post[]> => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  ).then((res) => res.json());

  return response;
};

const post = async (newTodo: Omit<Post, "id" | "userId">): Promise<Post> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(newTodo),
  });

  if (!response.ok) {
    throw new Error("Something went wrong with getting the data");
  }
  return response.json();
};

function App() {
  const queryClient = useQueryClient();

  const { data: todos } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchTodos,
  });

  const mutation = useMutation({
    mutationFn: post,
    onSuccess: (newPost) => {
      // queryClient.invalidateQueries({ queryKey: ["posts"] });//to get new list of data back

      //Modifying the cache data and adding the data manually.
      queryClient.setQueryData(["posts"], (oldPosts: Array<Post>) => [
        ...oldPosts,
        newPost,
      ]);
    },
  });

  return (
    <>
      <div>
        <a href="https://tanstack.com/query/latest" target="_blank">
          <img src={reactqueryLogo} className="logo" alt="React Query logo" />
        </a>
      </div>
      <h1>React Query</h1>
      {todos?.map((todo) => (
        <div className="card" key={todo.id}>
          <button onClick={() => {}}>{todo.title}</button>
        </div>
      ))}
      <button
        onClick={() =>
          mutation.mutate({
            title: "A good Man",
            body: "Doing what is always right",
          })
        }
      >
        Add Post
      </button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

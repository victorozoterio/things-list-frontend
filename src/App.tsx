import { useEffect, useState, useRef, type FormEvent } from "react";
import { MdOutlineRadioButtonUnchecked, MdCheck } from "react-icons/md";
import { api } from "./services/api";

interface CustomersProps {
  uuid: string;
  name: string;
  priority: string;
  is_done: boolean;
  created_at: Date;
  updated_at: Date;
}

export default function App() {
  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/");
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value) return;

    const response = await api.post("/", {
      name: nameRef.current?.value,
    });

    // acrescenta na tela o item que foi criado
    setCustomers((allCustomers) => [...allCustomers, response.data]);
    nameRef.current.value = "";
  }

  async function handleDelete(uuid: string) {
    try {
      await api.delete(`/${uuid}`);

      // devolve todos os itens menos aquele que foi clicado
      const allCustomers = customers.filter(
        (customer) => customer.uuid !== uuid
      );
      setCustomers(allCustomers);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-3xl">
        <h1 className="text-4xl font-medium text-white">Lista de Tarefas</h1>

        <form className="flex flex my-1" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Insira sua tarefa"
            className="w-10/12 mb-5 p-2 rounded"
            ref={nameRef}
          />

          <input
            type="submit"
            value="ADD"
            className="cursor-pointer w-2/12 mb-5 p-2 ml-2 bg-green-500 rounded font-semibold"
          />
        </form>

        <section className="flex flex-col gap-4">
          {customers.map((customer) => (
            <article
              key={customer.uuid}
              className="w-full bg-white rounded p-2 relative group"
            >
              <p className="ml-7">{customer.name}</p>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                className="bg-white flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 ml-2 rounded-full"
                onClick={() => handleDelete(customer.uuid)}
              >
                <MdOutlineRadioButtonUnchecked size={23} color="#000" />
                <MdCheck
                  size={19}
                  color="#000"
                  className="absolute opacity-0 hover:opacity-100 transition-opacity duration-400"
                />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

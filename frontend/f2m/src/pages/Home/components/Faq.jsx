import { Accordion } from "./Accordion";

export const Faq = () => {
  const faqs = [
    {
      id: 1,
      question: "Why should I use CodeBook?",
      answer:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus earum dicta nesciunt, nulla alias consequuntur cumque incidunt saepe mollitia esse! Magni praesentium delectus excepturi nostrum illo repellendus cum eius neque, aperiam dolores quaerat quis dolore magnam doloremque minus sint nemo qui necessitatibus at. Perspiciatis, corrupti cum labore quos odio porro!",
    },
    {
      id: 2,
      question: "Can I access my eBook on mobile?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At accusamus nobis tempore perferendis qui, quam, atque reprehenderit vero quaerat, assumenda pariatur eveniet. Maxime eaque, neque corrupti ad minus repudiandae consectetur!",
    },
    {
      id: 3,
      question: "Do you offer refunds?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse iste dolor deserunt expedita quam fugit et inventore amet pariatur. Animi.",
    },
    {
      id: 4,
      question: "Do you support International payments?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse iste dolor deserunt expedita quam fugit et inventore amet pariatur. Animi.",
    },
  ];

  return (
    <section className="my-10 p-7 border rounded shadow-sm border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white">
      <h1 className="text-2xl text-center font-semibold mb-3 underline underline-offset-8 text-gray-900 dark:text-white">
        Question in mind?
      </h1>

      <div
        id="accordion-flush"
        className="text-gray-700 dark:text-white"
        data-accordion="collapse"
        data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        data-inactive-classes="text-gray-500 dark:text-white"
      >
        {faqs.map((faq) => (
          <Accordion key={faq.id} faq={faq} />
        ))}
      </div>
    </section>
  );
};
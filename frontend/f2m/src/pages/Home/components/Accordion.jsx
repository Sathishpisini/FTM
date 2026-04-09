import { useState } from "react";

export const Accordion = ({ faq }) => {
  const { question, answer } = faq;
  const [show, setShow] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900">

      <h2>
        <button
          onClick={() => setShow(!show)}
          type="button"
          className="text-lg flex items-center justify-between w-full py-5 font-medium text-left 
          text-gray-700 dark:text-white
          border-b border-gray-200 dark:border-gray-700"
        >

          {/* QUESTION */}
          <span className="text-xl text-gray-900 dark:text-white">
            {question}
          </span>

          {/* ICON CLOSED */}
          {!show && (
            <svg
              className="w-6 h-6 shrink-0 text-gray-700 dark:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 
                1 0 111.414 1.414l-4 4a1 1 0 
                01-1.414 0l-4-4a1 1 0 
                010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}

          {/* ICON OPEN */}
          {show && (
            <svg
              className="rotate-180 w-6 h-6 shrink-0 text-gray-700 dark:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 
                1 0 111.414 1.414l-4 4a1 1 0 
                01-1.414 0l-4-4a1 1 0 
                010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </h2>

      {/* ANSWER */}
      {show && (
        <div>
          <div className="py-5 border-b border-gray-200 dark:border-gray-700">
            <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
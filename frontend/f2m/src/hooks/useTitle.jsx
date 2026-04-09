import { useEffect } from "react";

export const useTitle = (title) => {

    useEffect(() => {
        document.title = `${title} - F2M`;
    }, [title]);

  return null;
}
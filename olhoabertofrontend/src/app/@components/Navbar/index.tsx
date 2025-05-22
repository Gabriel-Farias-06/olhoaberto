"use client";

import React from "react";
import * as S from "./styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  // const [openMenu, setOpenMenu] = useState(false);
  // const dialogRef = useRef<HTMLDialogElement>(null);

  // useEffect(() => {
  //   const dialog = dialogRef.current;
  //   if (!dialog) return;

  //   if (openMenu && !dialog.open) {
  //     dialog.showModal();
  //   }

  //   const handleClickOutside = (event) => {
  //     if (dialogRef.current && event.target === dialogRef.current) {
  //       setOpenMenu(false);
  //     }
  //   };

  //   dialog.addEventListener("click", handleClickOutside);
  //   return () => dialog.removeEventListener("click", handleClickOutside);
  // }, [openMenu]);
  const { toggleTheme, isDarkMode } = useTheme();
  return (
    <S.Navbar>
      <button onClick={() => toggleTheme()}>
        {isDarkMode ? (
          <FontAwesomeIcon icon={faMoon} size="2x" />
        ) : (
          <FontAwesomeIcon icon={faSun} size="2x" />
        )}
      </button>

      {/* <dialog style={{ width: "30rem", height: "30rem" }} ref={dialogRef}>
        Conteúdo do menu
      </dialog> */}
    </S.Navbar>
  );
};

export default Navbar;

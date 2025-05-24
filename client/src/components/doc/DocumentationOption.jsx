import React, { useRef } from "react";
import "../../styles/DocumentationOption.css";

function DocumentationOption({ setFile, ref }) {
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  return (
    <div className="file-select" ref={ref}>
      <div className="options1">
        <div
          className="option1"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            style={{ display: "none" }}
            ref={fileInputRef}
            multiple={false}
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
          <svg
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 0C0.9 0 0.01 0.9 0.01 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6.83C16 6.3 15.79 5.79 15.41 5.42L10.58 0.59C10.21 0.21 9.7 0 9.17 0H2ZM9 6V1.5L14.5 7H10C9.45 7 9 6.55 9 6ZM4 10C3.44772 10 3 10.4477 3 11C3 11.5523 3.44772 12 4 12H12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10H4ZM10 15C10 14.4477 9.55228 14 9 14H4C3.44772 14 3 14.4477 3 15C3 15.5523 3.44772 16 4 16H9C9.55228 16 10 15.5523 10 15Z"
              fill="#6494ed"
            ></path>
          </svg>
          <span>Document</span>
        </div>
        <button
          className="option1"
          onClick={() => {
            if (imageInputRef.current) {
              imageInputRef.current.click();
            }
          }}
        >
          <input
            type="file"
            accept="image/*, video/*"
            style={{ display: "none" }}
            ref={imageInputRef}
            multiple={false}
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 14V2C20 0.9 19.1 0 18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14ZM9.4 10.53L11.03 12.71L13.61 9.49C13.81 9.24 14.19 9.24 14.39 9.49L17.35 13.19C17.61 13.52 17.38 14 16.96 14H7C6.59 14 6.35 13.53 6.6 13.2L8.6 10.53C8.8 10.27 9.2 10.27 9.4 10.53ZM0 18V5C0 4.45 0.45 4 1 4C1.55 4 2 4.45 2 5V17C2 17.55 2.45 18 3 18H15C15.55 18 16 18.45 16 19C16 19.55 15.55 20 15 20H2C0.9 20 0 19.1 0 18Z"
              fill="#0882fc"
            ></path>
          </svg>
          <span>Photos & videos</span>
        </button>
        <div className="option1">
          <svg
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.9999 13.04C8.16657 13.04 6.67479 11.5482 6.67479 9.71486C6.67479 7.88153 8.16657 6.38976 9.9999 6.38976C11.8332 6.38976 13.325 7.88153 13.325 9.71486C13.325 11.5482 11.8332 13.04 9.9999 13.04Z"
              fill="#e84a7c"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.606 1.6763C14.9347 2.23849 15.5121 2.60821 16.1634 2.60821H16.2429C18.3177 2.60821 20 4.29014 20 6.36531V14.8157C20 16.8902 18.3177 18.5725 16.2429 18.5725H3.7571C1.68226 18.5725 0 16.8902 0 14.8157V6.36531C0 4.29014 1.68226 2.60821 3.7571 2.60821H3.83661C4.48792 2.60821 5.06535 2.23849 5.39398 1.6763C5.98035 0.673833 7.06697 0 8.3126 0H11.6874C12.933 0 14.0193 0.673833 14.606 1.6763ZM9.9999 4.73333C7.25322 4.73333 5.01837 6.96818 5.01837 9.71486C5.01837 12.4615 7.25322 14.6964 9.9999 14.6964C12.7466 14.6964 14.9814 12.4615 14.9814 9.71486C14.9814 6.96818 12.7466 4.73333 9.9999 4.73333Z"
              fill="#e84a7c"
            ></path>
          </svg>
          <span>Camera</span>
        </div>
        <div className="option1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 4C12 6.21 10.21 8 8 8C5.79 8 4 6.21 4 4C4 1.79 5.79 0 8 0C10.21 0 12 1.79 12 4ZM0 14C0 11.34 5.33 10 8 10C10.67 10 16 11.34 16 14V15C16 15.55 15.55 16 15 16H1C0.45 16 0 15.55 0 15V14Z"
              fill="#0eb54c"
            ></path>
          </svg>
          <span>Contact</span>
        </div>
      </div>
    </div>
  );
}

export default DocumentationOption;

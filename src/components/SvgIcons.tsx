import { useTheme } from "../ThemeContext";

interface SvgIconProps {
  fill?: string; // 填充颜色
  stroke?: string; // 描边颜色
  className?: string;
  onClick?: any;
  children: React.ReactNode; // 子元素，用于传递 SVG 路径
}

const SvgIcon: React.FC<SvgIconProps> = ({
  fill = "currentColor",
  stroke = "none",
  className = "",
  onClick,
  children,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    // viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    className={className}
    onClick={onClick}
  >
    {children}
  </svg>
);

export const LogoIcon = () => {
  return (
    <SvgIcon
      className="mb-1 text-blue-600 w-7 h-7"
      onClick={(e: { preventDefault: () => void }) => {
        e.preventDefault();
      }}
    >
      <path d="M20.553 3.105l-6 3C11.225 7.77 9.274 9.953 8.755 12.6c-.738 3.751 1.992 7.958 2.861 8.321A.985.985 0 0012 21c6.682 0 11-3.532 11-9 0-6.691-.9-8.318-1.293-8.707a1 1 0 00-1.154-.188zm-7.6 15.86a8.594 8.594 0 015.44-8.046 1 1 0 10-.788-1.838 10.363 10.363 0 00-6.393 7.667 6.59 6.59 0 01-.494-3.777c.4-2 1.989-3.706 4.728-5.076l5.03-2.515A29.2 29.2 0 0121 12c0 4.063-3.06 6.67-8.046 6.965zM3.523 5.38A29.2 29.2 0 003 12a6.386 6.386 0 004.366 6.212 1 1 0 11-.732 1.861A8.377 8.377 0 011 12c0-6.691.9-8.318 1.293-8.707a1 1 0 011.154-.188l6 3A1 1 0 018.553 7.9z"></path>
    </SvgIcon>
  );
};

export const NewConversationIcon = () => {
  return (
    <SvgIcon className="text-slate-500 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-600 w-6 h-6 stroke-current fill-none stroke-2">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M8 9h8"></path>
      <path d="M8 13h6"></path>
      <path d="M12.01 18.594l-4.01 2.406v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5"></path>
      <path d="M16 19h6"></path>
      <path d="M19 16v6"></path>
    </SvgIcon>
  );
};

export const ConversationsIcon = () => {
  return (
    <SvgIcon className="text-slate-500 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-600 stroke-current fill-none stroke-2 w-6 h-6">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"></path>
      <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"></path>
    </SvgIcon>
  );
};

export const DiscoverIcon = () => {
  return (
    <SvgIcon className="text-slate-500 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-600 w-6 h-6 stroke-current fill-none stroke-2">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
      <path d="M21 21l-6 -6"></path>
    </SvgIcon>
  );
};

export const UserIcon = () => {
  return (
    <SvgIcon className="text-slate-500 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-600 w-6 h-6 stroke-current fill-none stroke-2">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
      <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
      <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
    </SvgIcon>
  );
};

export const SettingsIcon = () => {
  return (
    <SvgIcon className="text-slate-500 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-600 w-6 h-6 stroke-current fill-none stroke-2">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"></path>
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
    </SvgIcon>
  );
};

export const WhisperIcon = () => {
  return (
    <SvgIcon className="text-slate-500 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-600 w-6 h-6 stroke-current fill-none stroke-2">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 4v16" />
      <path d="M8 8v8" />
      <path d="M4 10v4" />
      <path d="M16 8v8" />
      <path d="M20 10v4" />
      <path d="M4 18l4 -4" />
      <path d="M4 14l4 4" />
      <path d="M16 18h4" />
      <path d="M16 14h4" />
    </SvgIcon>
  );
};

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <SvgIcon
      className="text-slate-500 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-600 w-6 h-6 stroke-current fill-none stroke-2"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <>
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
        </>
      ) : (
        <>
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
        </>
      )}
    </SvgIcon>
  );
};

export const ActionIcon = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-icon="MoreOutlined"
    >
      <path
        d="M5.5 11.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm8.225 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm8.275 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
export const ContentIcon = () => {
  return (
    <svg
      width="120"
      height="68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path d="M120 0H0v68h120V0z" fill="url(#paint0_linear)" />
      <path fill="url(#pattern0)" d="M34 9h56v53H34z" />
      <path
        d="M75 33c0-7-6-12-12-12h-6c-6 0-12 5-12 12v11c0 2 1 3 3 3h1c3 0 5-2 5-5v-2c0-2-2-5-5-5h-1v-2c0-5 4-9 9-9h6c5 0 9 4 9 9v2h-1c-3 0-5 3-5 5v2c0 3 2 5 5 5h1c2 0 3-1 3-3V33z"
        fill="url(#paint1_linear)"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="121.2"
          y1="34"
          x2="-.9"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#71D6F7" />
          <stop offset="1" stop-color="#8BEDF2" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="45"
          y1="34"
          x2="75"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#fff" />
          <stop offset="1" stop-color="#C8FAFC" />
        </linearGradient>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0" />
        </pattern>
        <image
          id="image0"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA2CAYAAAB9TjFQAAAACXBIWXMAAAsSAAALEgHS3X78AAAA"
        />
      </defs>
    </svg>
  );
};

export const CaptionBackIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-icon="LeftOutlined"
  >
    <path
      d="M16.293 2.293a1 1 0 0 1 0 1.414L8 12l8.293 8.293a1 1 0 0 1-1.414 1.414l-8.293-8.293a2 2 0 0 1 0-2.828l8.293-8.293a1 1 0 0 1 1.414 0Z"
      fill="currentColor"
    ></path>
  </svg>
);

export const InputDeleteIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-icon="CloseFilled"
  >
    <path
      d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11ZM7.465 8.88l3.12 3.12-3.12 3.121a1 1 0 1 0 1.414 1.414L12 13.415l3.121 3.12a1 1 0 1 0 1.415-1.414L13.414 12l3.122-3.121a1 1 0 0 0-1.415-1.415l-3.12 3.122-3.122-3.122A1 1 0 0 0 7.465 8.88Z"
      fill="currentColor"
    ></path>
  </svg>
);

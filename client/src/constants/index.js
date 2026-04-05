import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    if (refreshToken || accessToken) {
      config.headers.Authorization = `Bearer ${refreshToken || ""},${accessToken || ""}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const navLinks = [
  { id: "0", title: "Home", path: "/" },
  { id: "1", title: "Vehicles", path: "/vehicles" },
  { id: "2", title: "Enterprise", path: "/enterprise" },
  { id: "3", title: "Contact", path: "/contact" },
];

const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",
  heading2:
    "font-poppins font-semibold xs:text-[48px] text-[28px] text-white xs:leading-[76.8px] lg:leading-[66.8px] w-full",
  paragraph:
    "font-poppins font-normal text-gray-300 text-[18px] leading-[30.8px]",
  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",
  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
  button:
    "bg-green-500 py-1 text-[12px] md:text-[14px] sm:py-2 px-2 sm:px-4 font-normal sm:font-semibold rounded-md",
  iconFlex: "flex justify-start items-center gap-2",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY}`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,
  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,
  sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

export default styles;
const inputStyle = {
  borderColor: "hsl(0,0%,80%)",
  borderRadius: "4px",
  borderStyle: "solid",
  borderWidth: "1px",
};

const customSelect = {
  control: (base) => ({
    ...base,
    height: 35,
    minHeight: 35,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const notification = {
  position: "top-right",
  autoClose: 6000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  limit: 1,
};

const changeSizeValues = [
  { value: "0", label: "10" },
  { value: "1", label: "20" },
  { value: "2", label: "50" },
];
const refresh = () => {
  window.location.reload();
};

const customStylesfw = {
  menuPortal: (base) => ({ ...base, zIndex: 9999, width: "100%" }),
  container: (provided) => ({
    ...provided,
    width: "30vw",
    minWidth: "10rem",
    height: "2rem",
    display: "flex",
    flex: "1",
  }),
  menu: (provided) => ({
    ...provided,
    width: "300%",
    maxWidth: "430px",
  }),
  control: (provided) => ({
    ...provided,
    display: "flex",
    minHeight: "2rem",
    flex: "1",
    maxWidth: "100% !important",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    display: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: "nowrap",
    width: "20vw",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
};

const customStylesfwreceived = {
  menuPortal: (base) => ({ ...base, zIndex: 9999, width: "100%" }),
  container: (provided) => ({
    ...provided,
    width: "28vw",
    minWidth: "10rem",
    display: "flex",
    flex: "1",
  }),
  menu: (provided) => ({
    ...provided,
  }),
  control: (provided) => ({
    ...provided,
    display: "flex",
    minHeight: "2rem",
    flex: "1",
    maxWidth: "100% !important",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    display: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: "nowrap",
    width: "20vw",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
};

const customOrderStylesfw = {
  menuPortal: (base) => ({ ...base, zIndex: 9999, width: "100%" }),
  container: (provided) => ({
    ...provided,
    width: "30vw",
    minWidth: "10rem",
    height: "2rem",
    display: "flex",
    flex: "1",
  }),
  menu: (provided) => ({
    ...provided,
    width: "120%",
  }),
  control: (provided) => ({
    ...provided,
    display: "flex",
    minHeight: "2rem",
    maxWidth: "100% !important",
    flex: "1",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    position: "relative",
    top: "-3px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    position: "",
  }),
  singleValue: (provided) => ({
    ...provided,
    paddingRight: "35px",
  }),
  dropdownIndicator: () => ({ display: "none" }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: "nowrap",
    width: "12vw",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
};

const listResultValues = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 50, label: "50" },
];

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const statusOption = [
  { value: -1, label: "Tất cả" },
  { value: 1, label: "Hoạt động" },
  { value: 0, label: "Không hoạt động" },
];

const statusOptionForm = [
  { value: 1, label: "Hoạt động" },
  { value: 0, label: "Không hoạt động" },
];

const statusEmployee = [
  { value: 1, label: "Hoạt động" },
  { value: 0, label: "Không hoạt động" },
  { value: 2, label: "Khóa" },
];
const statusGenderForm = [
  { value: 1, label: "Nam" },
  { value: 0, label: "Nữ" },
];
const statusOptionYesNo = [
  { value: 1, label: "Có" },
  { value: 2, label: "Không" },
];
const statusOptionYesNoAll = [
  { value: -1, label: "Tất cả" },
  { value: 1, label: "Có" },
  { value: 2, label: "Không" },
];
const statusOptionYesNoAll2 = [
  { value: -1, label: "Tất cả" },
  { value: 1, label: "Có" },
  { value: 0, label: "Không" },
];

const statusOptionYesNo01 = [
  { value: 1, label: "Có" },
  { value: 0, label: "Không" },
];

const optionTypeReport = [
  { value: 1, label: "Đơn lẻ" },
  { value: 2, label: "Hợp nhất" },
];

const optionTypeContract = [
  { value: 1, label: "Hợp đồng lao động" },
  { value: 2, label: "Hợp đồng thử việc" },
  { value: 3, label: "Hợp đồng dịch vụ" },
];

const optionTypeForm = [
  { value: 1, label: "Hợp đồng" },
  { value: 2, label: "Phụ lục hợp đồng" },
  { value: 3, label: "Quyết định nghỉ việc" },
  { value: 4, label: "Biên bản thanh lý hợp đồng" },
  { value: 5, label: "Biên bản nghiệm thu và thanh lý hợp đồng" },
];

const optionAddendum = [
  { value: 1, label: "Phụ lục ban đầu" },
  { value: 2, label: "Thay đổi lương thưởng" },
  { value: 3, label: "Thay đổi vị trí công việc" },
  { value: 4, label: "Thay đổi vị trí và lương thưởng" },
];

export {
  inputStyle,
  customStylesfwreceived,
  customSelect,
  notification,
  changeSizeValues,
  refresh,
  customOrderStylesfw,
  customStylesfw,
  listResultValues,
  a11yProps,
  statusOption,
  statusOptionForm,
  statusGenderForm,
  optionTypeReport,
  statusOptionYesNo,
  statusOptionYesNoAll,
  statusOptionYesNo01,
  optionTypeContract,
  optionTypeForm,
  optionAddendum,
  statusOptionYesNoAll2,
  statusEmployee
};

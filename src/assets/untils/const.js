export const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
export const uid = JSON.parse(localStorage.getItem("user"))?.uid;
export const role = JSON.parse(localStorage.getItem("user"))?.role;

export const dvt = [
    {
        dvtCode: "000",
        quality: "1",
        name: "Lẻ",
    },
    {
        dvtCode: "001",
        name: "Thùng"
    },
    {
        dvtCode: "002",
        name: "Vỉ",
    },
    {
        dvtCode: "003",
        name: "Bịch",
    },
]

export const getCode = (code) => {
    return code + new Date().getTime();
}

export const donvi = [
    {
        code: "vnd",
        name: "VNĐ"
    },
    {
        code: "percent",
        name: "%"
    }
]

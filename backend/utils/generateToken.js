import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userID, res) => {
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {
        expiresIn : '15d' //token will expire in 15 days from current time
    })

    res.cookie("jwt", token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, // tuổi của cookie có hạn 15 ngày
        httpOnly: true, //Đây là một biện pháp bảo mật để ngăn chặn các cuộc tấn công chèn mã giả mạo (XSS).
        sameSite: "strict", // chặn gửi cookie chéo trang để đảm bảo cookie chỉ được gửi từ một trang web
        secure: process.env.NODE_ENV !== "development" //Do đó, đoạn mã secure: process.env.NODE_ENV !== "development" có nghĩa là nếu môi trường của ứng dụng không phải là môi trường phát triển (tức là môi trường sản xuất hoặc một môi trường khác), thì thuộc tính "secure" của cookie sẽ được thiết lập thành true, đảm bảo rằng cookie chỉ được gửi qua kênh an toàn (HTTPS). Điều này giúp bảo mật thông tin trong cookie trên môi trường sản xuất hoặc các môi trường sản xuất tương tự. 
    })

    return token;
}

export default generateTokenAndSetCookie;
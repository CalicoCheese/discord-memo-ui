export const api = {
    host:
        process.env.NODE_ENV === "production"
            ? "https://memo-api.calicocheese.xyz"
            : "http://localhost:5000",
};

export const token = {
    key: "dmui-token",
    exp: "dmui-exp",
    password: "dmui-pw",
    admin: "dmui-admin",
};

export const home = {
    email: "mailto:team@calicocheese.xyz",
    github: {
        profile: "https://github.com/CalicoCheese",
        api: "https://github.com/CalicoCheese/discord-memo-api",
        ui: "https://github.com/CalicoCheese/discord-memo-ui",
        bot: "https://github.com/CalicoCheese/discord-memo-bot",
    },
};

export const notice = [
    {
        text: "개인정보 처리방침",
        code: 1,
    },
    {
        text: "서비스 이용약관",
        code: 2,
    },
];

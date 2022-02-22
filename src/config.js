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
    profile: "https://github.com/CalicoCheese",
    projects: [
        {
            display: "UI",
            text: "Vue.JS로 만들어진 클라이언트 입니다.",
            url: "https://github.com/CalicoCheese/discord-memo-ui",
        },
        {
            display: "API",
            text: "파이썬 flask로 만들어진 API입니다.",
            url: "https://github.com/CalicoCheese/discord-memo-api",
        },
        // {
        //     display: "BOT",
        //     text: "파이썬으로 만들어진 디스코드 봇 입니다.",
        //     url: "https://github.com/CalicoCheese/discord-memo-bot",
        // },
    ],
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

import axios from "axios";
import Swal from "sweetalert2";
import { getToken, defaultError } from "@/utils";
import { api } from "@/config";

function editMemo(m) {
    let text = m.text.trim();
    if (m.encrypted) {
        text = m.encCipher;
    }

    axios({
        method: "PUT",
        url: `${api.host}/memo/${m.id}`,
        headers: {
            Authorization: getToken(),
        },
        data: {
            edit: m.edit,
            text: text,
            encrypted: m.encrypted,
        },
    })
        .then((e) => {
            const data = e.data;
            Swal.fire({
                icon: "success",
                text: data.meta.message,
                timer: 2022,
                timerProgressBar: true,
            });
        })
        .catch((e) => defaultError(e));
}

function deleteMemo(m, ms) {
    axios({
        method: "DELETE",
        url: `${api.host}/memo/${m.id}`,
        headers: {
            Authorization: getToken(),
        },
    })
        .then((e) => {
            const data = e.data;
            Swal.fire({
                icon: "success",
                text: data.meta.message,
                timer: 2022,
                timerProgressBar: true,
            });

            delete ms.value[m.id];
        })
        .catch((e) => defaultError(e));
}

export function saveMemo(m, ms) {
    if (m.text.trim().length == 0) {
        deleteMemo(m, ms);
    } else {
        editMemo(m);
    }
}

export function createMemo() {
    return new Promise((resolve, reject) => {
        Swal.fire({
            input: "textarea",
        }).then((e) => {
            axios({
                method: "POST",
                url: `${api.host}/memo`,
                headers: {
                    Authorization: getToken(),
                },
                data: {
                    text: e.value,
                    encrypted: false,
                },
            })
                .then((e) => {
                    resolve(e);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    });
}

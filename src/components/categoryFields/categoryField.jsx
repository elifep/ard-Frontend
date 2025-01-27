import React from "react";

const categoryFields = {
    MediaScan: [
        { name: "source", label: "Kaynak", required: true },
        { name: "imageLink", label: "Görsel Link", required: false },
    ],
    STK: [
        { name: "notificationAgency", label: "Bildirim Kurumu", required: true },
    ],
    BaroCommissions: [
        { name: "commission", label: "Vakanın Alındığı Komisyon", required: true },
    ],
    PublicInstitutions: [
        { name: "publicInstitution", label: "Kamu Kurumu", required: true },
    ],
};

export default categoryFields;

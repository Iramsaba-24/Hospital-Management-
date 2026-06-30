import { useMemo, useState } from "react";
import ControlTable, { type Column } from "../../../components/controlled/Controltable";
import ButtonField from "../../../components/controlled/ButtonField";
import AddReferralPayment from "./AddReferralPayment";
import ReferralPerson from "./ReferralPerson";
import type { ReferralPayment as ReferralPaymentType } from "./types";
import { paymentData } from "./referralData";

const ReferralPayment = () => {
  const [payments, setPayments] =
    useState<ReferralPaymentType[]>(paymentData);

  const [search, setSearch] = useState("");

  const [openPayment, setOpenPayment] = useState(false);

  const [showReferralPerson, setShowReferralPerson] = useState(false);

  const [editData, setEditData] =
    useState<ReferralPaymentType | null>(null);

  const filteredData = useMemo(() => {
    return payments.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [payments, search]);

 const columns: Column<ReferralPaymentType>[] = [
  {
    key: "payee",
    label: "Payee",
  },
  {
    key: "patient",
    label: "Patient Name",
  },
  {
    key: "billNo",
    label: "Bill No",
  },
  {
    key: "billAmount",
    label: "Bill Amount",
  },
  {
    key: "commissionPercentage",
    label: "Commission %",
    render: (value) => `${value}%`,
  },
  {
    key: "commissionAmount",
    label: "Commission Amount",
  },
];

  const handleSave = (data: ReferralPaymentType) => {
    if (editData) {
      setPayments((prev) =>
        prev.map((item) =>
          item.id === editData.id
            ? {
                ...data,
                id: editData.id,
              }
            : item
        )
      );
    } else {
      setPayments((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now(),
        },
      ]);
    }

    setOpenPayment(false);
    setEditData(null);
  };

  const handleDelete = (id: number | string) => {
    setPayments((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const handleEdit = (id: number | string) => {
    const data = payments.find((x) => x.id === id);

    if (!data) return;

    setEditData(data);
    setOpenPayment(true);
  };

  if (showReferralPerson) {
    return (
      <ReferralPerson
        onBack={() => setShowReferralPerson(false)}
      />
    );
  }

  return (
    <div className="p-4">

      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">

        <h2 className="text-xl font-semibold">
          Referral Payment List
        </h2>

        <div className="flex flex-wrap gap-2">

          <ButtonField
            loading={false}
            name="Add Referral Payment"
            clr="#1d4ed8"
            onClick={() => {
              setEditData(null);
              setOpenPayment(true);
            }}
          />

          <ButtonField
            loading={false}
            name="Referral Person"
            clr="#2563eb"
            onClick={() => setShowReferralPerson(true)}
          />

        </div>
      </div>

      <ControlTable
        title=""
        data={filteredData}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No Referral Payments"
      />

      <AddReferralPayment
        open={openPayment}
        onClose={() => {
          setOpenPayment(false);
          setEditData(null);
        }}
        data={editData}
        onSave={handleSave}
      />

    </div>
  );
};

export default ReferralPayment;
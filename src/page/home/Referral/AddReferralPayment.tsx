import { useEffect } from "react";
import { useForm, useWatch, type Control, type FieldValues } from "react-hook-form";
import Dropdown from "../../../components/controlled/Dropdown";
import TextField from "../../../components/controlled/TextField";
import ButtonField from "../../../components/controlled/ButtonField";
import type { ReferralPayment } from "./types";

interface Props {
    open: boolean;
    onClose: () => void;
    data: ReferralPayment | null;
    onSave: (data: ReferralPayment) => void;
}


const patientOptions = [
    { label: "Ramesh Patil", value: "Ramesh Patil" },
    { label: "Yogesh Patil", value: "Yogesh Patil" },
    { label: "Shreyash Bhat", value: "Shreyash Bhat" },
];

const payeeOptions = [
    { label: "Apolline", value: "Apolline" },
    { label: "Suresh Verma", value: "Suresh Verma" },
    { label: "Ayush Kumar", value: "Ayush Kumar" },
];

const bills = [
    {
        billNo: "OPDN18",
        patient: "Ramesh Patil",
        type: "OPD",
        amount: 20000,
    },
    {
        billNo: "PHARM349",
        patient: "Yogesh Patil",
        type: "Pharmacy",
        amount: 10000,
    },
    {
        billNo: "IPDN118",
        patient: "Shreyash Bhat",
        type: "IPD",
        amount: 1000,
    },
];

const AddReferralPayment = ({
    open,
    onClose,
    data,
    onSave,
}: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            id: 0,
            patient: "",
            patientType: "",
            billNo: "",
            billAmount: 0,
            payee: "",
            commissionPercentage: 5,
            commissionAmount: 0,
        },
    });

    const formControl = control as unknown as Control<FieldValues>;

    const billNo = useWatch({
        control,
        name: "billNo",
    });

    const commission = useWatch({
        control,
        name: "commissionPercentage",
    });

    const billAmount = useWatch({
        control,
        name: "billAmount",
    });

    useEffect(() => {
        if (data) {
            reset(data);
        } else {
            reset();
        }
    }, [data, reset]);

    useEffect(() => {
        const bill = bills.find((x) => x.billNo === billNo);

        if (bill) {
            setValue("patient", bill.patient);
            setValue("patientType", bill.type);
            setValue("billAmount", bill.amount);
        }
    }, [billNo, setValue]);

    useEffect(() => {
        const amount =
            (Number(billAmount) * Number(commission)) / 100;

        setValue("commissionAmount", amount);
    }, [commission, billAmount, setValue]);

    const submit = (form: ReferralPayment) => {
        onSave(form);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 text-xs">

            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl">

                {/* Header */}

                <div className="bg-blue-600 text-white px-5 py-3 rounded-t-lg flex justify-between">

                    <h2 className="font-semibold">
                        {data ? "Edit Referral Payment" : "Add Referral Payment"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl"
                    >
                        ×
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="p-6"
                >
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">

                        <Dropdown
                            control={formControl}
                            name="patient"
                            label="Patient"
                            required
                            options={patientOptions}
                        />

                        <Dropdown
                            control={formControl}
                            name="patientType"
                            label="Patient Type"
                            required
                            options={[
                                "OPD",
                                "IPD",
                                "Pharmacy",
                            ]}
                        />

                        <Dropdown
                            control={formControl}
                            name="billNo"
                            label="Bill No"
                            required
                            options={bills.map((x) => ({
                                label: x.billNo,
                                value: x.billNo,
                            }))}
                        />

                        <TextField
                            control={formControl}
                            name="billAmount"
                            label="Bill Amount"
                            disabled
                        />

                        <Dropdown
                            control={formControl}
                            name="payee"
                            label="Payee"
                            required
                            options={payeeOptions}
                        />

                        <Dropdown
                            control={formControl}
                            name="commissionPercentage"
                            label="Commission %"
                            required
                            options={[
                                { label: "5", value: 5 },
                                { label: "10", value: 10 },
                                { label: "15", value: 15 },
                                { label: "20", value: 20 },
                                { label: "25", value: 25 },
                                { label: "30", value: 30 },
                            ]}
                        />

                        <TextField
                            control={formControl}
                            name="commissionAmount"
                            label="Commission Amount"
                            disabled
                        />

                    </div>

                    <div className="flex justify-end mt-8 gap-3">

                        <ButtonField
                            loading={false}
                            name="Cancel"
                            clr="#6b7280"
                            onClick={onClose}
                        />

                        <ButtonField
                            loading={false}
                            name="Save"
                            clr="#2563eb"
                            type="submit"
                        />

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddReferralPayment;
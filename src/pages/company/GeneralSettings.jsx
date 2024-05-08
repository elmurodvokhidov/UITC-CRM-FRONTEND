import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import {
    companyFailure,
    companyStart,
    companySuccess
} from "../../redux/slices/companySlice";
import AuthService from "../../config/authService";
import Skeleton from "../../components/loaders/Skeleton";
import { Toast } from "../../config/sweetToast";

function GeneralSettings() {
    const { company, isLoading } = useSelector(state => state.company);
    const dispatch = useDispatch();
    const [companyCred, setCompanyCred] = useState({
        name: "",
        phoneNumber: "",
    });

    // Kompaniya ma'lumotlarini inputda olish funksiyasi
    const getCompanyCred = (e) => {
        setCompanyCred({
            ...companyCred,
            [e.target.name]: e.target.value
        });
    };

    // Mavjud kompaniyani olish funksiyasi
    const getCompanyFunction = async () => {
        try {
            dispatch(companyStart());
            const { data } = await AuthService.getCompany();
            setCompanyCred({
                name: data.data.name,
                phoneNumber: data.data.phoneNumber,
            });
            dispatch(companySuccess(data));
        } catch (error) {
            dispatch(companyFailure(error.response?.data.message));
        }
    };

    useEffect(() => {
        getCompanyFunction();
    }, []);

    // Kompaniy ma'lumotlarini o'zgartirish funksiyasi
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            dispatch(companyStart());
            const { data } = await AuthService.updateCompany(companyCred, company._id);
            dispatch(companySuccess(data));
            await Toast.fire({
                icon: "success",
                title: data.message
            });
        } catch (error) {
            dispatch(companyFailure(error.response?.data.message));
            await Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message
            });
        }
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 pb-10 px-10">
            <h1 className="text-3xl mb-8">Umumiy sozlamalar</h1>
            <form className="w-[450px] flex flex-col gap-4 border rounded-md shadow-md px-10 py-8 bg-white">
                {/* Company Name */}
                <div className="flex flex-col gap-2">
                    <label
                        className="flex gap-1"
                        htmlFor="name">
                        <span>Kompaniya nomi</span>
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        disabled={isLoading}
                        onChange={getCompanyCred}
                        value={companyCred.name}
                        type="text"
                        name="name"
                        id="name"
                        className="w-full border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600"
                    />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                    <label
                        className="flex gap-1"
                        htmlFor="phoneNumber">
                        <span>Kompaniya telefon raqami</span>
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                        <label htmlFor="phoneNumber" className="text-base border-2 border-r-0 rounded-l border-gray-300 px-2 py-1">+998</label>
                        <input
                            disabled={isLoading}
                            onChange={getCompanyCred}
                            value={companyCred.phoneNumber}
                            type="number"
                            name="phoneNumber"
                            id="phoneNumber"
                            className="w-full border-2 border-gray-300 rounded rounded-l-none px-2 py-1 outline-cyan-600"
                        />
                    </div>
                </div>

                {/* Button */}
                <div className="flex justify-end">
                    <button
                        disabled={!isLoading && companyCred.name !== "" && companyCred.phoneNumber !== "" ? false : true}
                        onClick={handleUpdate}
                        className="w-fit px-6 py-1 mt-8 bg-cyan-600 rounded-2xl text-white disabled:bg-gray-400">
                        {isLoading ? "Loading..." : "Saqlash"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default GeneralSettings
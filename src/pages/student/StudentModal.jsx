import { IoCloseOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { allGroupSuccess, groupFailure, groupStart } from "../../redux/slices/groupSlice";
import AuthService from "../../config/authService";

function StudentModal({
    modals,
    handleModal,
    newStudent,
    setNewStudent,
    newPass,
    setNewPass,
    handleCreateAndUpdate,
    isLoading,
    clearModal,
    groups,
}) {
    const getStudentCred = (e) => {
        setNewStudent({
            ...newStudent,
            [e.target.name]: e.target.value
        });
    };

    const getNewPass = (e) => {
        setNewPass({
            ...newPass,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div
            onClick={() => clearModal()}
            className="w-full h-screen fixed top-0 left-0 z-20"
            style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.modal ? "1" : "0", zIndex: modals.modal ? "20" : "-1" }}>
            <form
                onClick={(e) => e.stopPropagation()}
                className="w-[27%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.modal ? "0" : "-200%" }}>

                {/* Title and Close button */}
                <div className="flex justify-between text-xl p-5 border-b-2">
                    <h1>O'quvchi ma'lumotlari</h1>
                    <button
                        type="button"
                        onClick={() => clearModal()}
                        className="text-gray-500 hover:text-black transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Form's Body */}
                <div className="flex flex-col gap-4 px-5 py-7">
                    <div className="flex justify-between gap-4">
                        {/* First Name */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="first_name" className="text-[14px]">Ism</label>
                            <input
                                disabled={newStudent._id ? modals.passModal : false}
                                onChange={getStudentCred}
                                value={newStudent.first_name}
                                type="text"
                                name="first_name"
                                id="first_name"
                                className="border-2 border-gray-300 rounded px-2 py-1" />
                        </div>

                        {/* Last Name */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="last_name" className="text-[14px]">Familya</label>
                            <input
                                disabled={newStudent._id ? modals.passModal : false}
                                onChange={getStudentCred}
                                value={newStudent.last_name}
                                type="text"
                                name="last_name"
                                id="last_name"
                                className="border-2 border-gray-300 rounded px-2 py-1" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-[14px]">Email</label>
                        <input
                            disabled={newStudent._id ? modals.passModal : false}
                            onChange={getStudentCred}
                            value={newStudent.email}
                            type="email"
                            name="email"
                            id="email"
                            className="border-2 border-gray-300 rounded px-2 py-1" />
                    </div>

                    <div className="flex justify-between">
                        {/* Date of Birth */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="dob" className="text-[14px]">Tug'ilgan sana</label>
                            <input
                                disabled={newStudent._id ? modals.passModal : false}
                                onChange={getStudentCred}
                                value={newStudent.dob}
                                type="date"
                                name="dob"
                                id="dob"
                                className="border-2 border-gray-300 rounded px-2 py-1" />
                        </div>

                        {/* Contact Number */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="contactNumber" className="text-[14px]">Telefon</label>
                            <input
                                disabled={newStudent._id ? modals.passModal : false}
                                onChange={getStudentCred}
                                value={newStudent.contactNumber}
                                type="number"
                                name="contactNumber"
                                id="contactNumber"
                                className="border-2 border-gray-300 rounded px-2 py-1"
                                placeholder="998991234567" />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="w-full">
                        <p className="text-[14px]">Gender</p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-1">
                                <input
                                    disabled={newStudent._id ? modals.passModal : false}
                                    onChange={getStudentCred}
                                    checked={newStudent.gender === 'erkak'}
                                    value="erkak"
                                    type="radio"
                                    name="gender"
                                    id="erkak"
                                    className="border-gray-300" />
                                <label htmlFor="erkak" className="text-[14px]">Erkak</label>
                            </div>

                            <div className="flex items-center gap-1">
                                <input
                                    disabled={newStudent._id ? modals.passModal : false}
                                    onChange={getStudentCred}
                                    checked={newStudent.gender === 'ayol'}
                                    value="ayol"
                                    type="radio"
                                    name="gender"
                                    id="ayol"
                                    className="border-gray-300" />
                                <label htmlFor="ayol" className="text-[14px]">Ayol</label>
                            </div>
                        </div>
                    </div>

                    {/* Groups */}
                    <div className="w-full flex flex-col">
                        <label htmlFor="group" className="text-[14px]">Guruh</label>
                        <select
                            disabled={newStudent._id ? modals.passModal : false}
                            onChange={getStudentCred}
                            value={newStudent.group}
                            name="group"
                            id="group"
                            className="border-2 border-gray-300 rounded px-2 py-1">
                            <option value="" className="italic">None</option>
                            {
                                groups.map(group => (
                                    <option value={group._id} key={group._id}>{group.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Password */}
                    {
                        !modals.createModal ? <>
                            <button
                                onClick={() => {
                                    handleModal("passModal", !modals.passModal);
                                }}
                                type="button"
                                className="flex items-center justify-end gap-1 outline-none">
                                {
                                    modals.passModal
                                        ?
                                        <FaAngleUp className="text-[14px]" />
                                        :
                                        <FaAngleDown className="text-[14px]" />
                                }
                                Yangi parol qo'shing
                            </button>
                        </> : null
                    }
                    {
                        modals.passModal ? <>
                            <div className="flex justify-between">
                                <div className="w-[47%] flex flex-col">
                                    <label htmlFor="newPassword" className="text-[14px]">Yangi parol</label>
                                    <input
                                        onChange={getNewPass}
                                        value={newStudent.newPassword}
                                        type="text"
                                        name="newPassword"
                                        id="newPassword"
                                        className="border-2 border-gray-300 rounded px-2 py-1" />
                                </div>
                                <div className="w-[47%] flex flex-col">
                                    <label htmlFor="confirmPassword" className="text-[14px]">Parolni tasdiqlang</label>
                                    <input
                                        onChange={getNewPass}
                                        value={newStudent.confirmPassword}
                                        type="text"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        className="border-2 border-gray-300 rounded px-2 py-1" />
                                </div>
                            </div>
                        </> : null
                    }

                    {/* Parents */}
                    <button
                        onClick={() => handleModal("parentsModal", !modals.parentsModal)}
                        type="button"
                        className="flex items-center justify-end gap-1 outline-none">
                        {
                            modals.parentsModal
                                ?
                                <FaAngleUp className="text-[14px]" />
                                :
                                <FaAngleDown className="text-[14px]" />
                        }
                        Ota-ona ma'lumotlari
                    </button>
                    {
                        modals.parentsModal ? <>
                            <div className="grid grid-cols-2 justify-between gap-4">
                                {/* Father's Name */}
                                <div className="w-[100%] flex flex-col">
                                    <label htmlFor="father_name" className="text-[14px]">Otasining ismi</label>
                                    <input
                                        disabled={newStudent._id ? modals.passModal : false}
                                        onChange={getStudentCred}
                                        value={newStudent.father_name}
                                        type="text"
                                        name="father_name"
                                        id="father_name"
                                        className="border-2 border-gray-300 rounded px-2 py-1" />
                                </div>
                                {/* Father's Contact Number */}
                                <div className="w-[100%] flex flex-col">
                                    <label htmlFor="fatherContactNumber" className="text-[14px]">Telefon raqami</label>
                                    <input
                                        disabled={newStudent._id ? modals.passModal : false}
                                        onChange={getStudentCred}
                                        value={newStudent.fatherContactNumber}
                                        type="text"
                                        name="fatherContactNumber"
                                        id="fatherContactNumber"
                                        className="border-2 border-gray-300 rounded px-2 py-1"
                                        placeholder="998991234567" />
                                </div>
                                {/* Mother's Name */}
                                <div className="w-[100%] flex flex-col">
                                    <label htmlFor="mother_name" className="text-[14px]">Onasining ismi</label>
                                    <input
                                        onChange={getStudentCred}
                                        value={newStudent.mother_name}
                                        type="text"
                                        name="mother_name"
                                        id="mother_name"
                                        className="border-2 border-gray-300 rounded px-2 py-1" />
                                </div>
                                {/* Mother's Contact Number */}
                                <div className="w-[100%] flex flex-col">
                                    <label htmlFor="motherContactNumber" className="text-[14px]">Telefon raqami</label>
                                    <input
                                        onChange={getStudentCred}
                                        value={newStudent.motherContactNumber}
                                        type="text"
                                        name="motherContactNumber"
                                        id="motherContactNumber"
                                        className="border-2 border-gray-300 rounded px-2 py-1"
                                        placeholder="998991234567" />
                                </div>
                            </div>
                        </> : null
                    }

                    {/* Image */}
                    <button
                        onClick={() => handleModal("imageModal", !modals.imageModal)}
                        type="button"
                        className="flex items-center justify-end gap-1 outline-none">
                        {
                            modals.imageModal
                                ?
                                <FaAngleUp className="text-[14px]" />
                                :
                                <FaAngleDown className="text-[14px]" />
                        }
                        O'quvchi rasmi
                    </button>
                    {
                        modals.imageModal ? <>
                            <div className="flex flex-col">
                                <label htmlFor="avatar" className="text-[14px]">Rasm</label>
                                <input
                                    disabled={newStudent._id ? modals.passModal : false}
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    className="border-2 border-gray-300 rounded px-2 py-1" />
                            </div>
                        </> : null
                    }

                    {/* Button */}
                    <button
                        disabled={isLoading ? true : false}
                        onClick={handleCreateAndUpdate}
                        className="w-fit px-6 py-1 mt-8 bg-cyan-600 rounded-2xl text-white">
                        {isLoading ? "Loading..." : newStudent._id ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default StudentModal
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import AuthService from "../../config/authService";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import Swal from "sweetalert2";
import {
    allCourseSuccess,
    courseFailure,
    courseStart
} from "../../redux/slices/courseSlice";
import {
    allGroupSuccess,
    getGroupSuccess,
    groupFailure,
    groupStart
} from "../../redux/slices/groupSlice";
import {
    allTeacherSuccess,
    teacherFailure,
    teacherStart
} from "../../redux/slices/teacherSlice";
import {
    allRoomSuccess,
    roomFailure,
    roomStart
} from "../../redux/slices/roomSlice";
import GroupModal from "./GroupModal";
import { GoHorizontalRule } from "react-icons/go";

function Groups() {
    const { groups, isLoading } = useSelector(state => state.group);
    const { courses } = useSelector(state => state.course);
    const { teachers } = useSelector(state => state.teacher);
    const { rooms } = useSelector(state => state.room);
    const dispatch = useDispatch();
    const [newGroup, setNewGroup] = useState({
        name: "",
        course: "",
        teacher: "",
        day: "",
        room: "",
        start_time: "",
        start_date: "",
        end_date: "",
    });
    const [modals, setModals] = useState({
        modal: false,
        more: null,
    });
    const [filters, setFilters] = useState({
        teacher: "",
        course: "",
        day: "",
        start_date: "",
        end_date: ""
    });
    const navigate = useNavigate();
    const [days, setDays] = useState(['Toq kunlari', 'Juft kunlari', 'Dam olish kuni', 'Har kuni',]);

    const getAllGroupsFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await AuthService.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    const getAllCoursesFunc = async () => {
        try {
            dispatch(courseStart());
            const { data } = await AuthService.getAllCourses();
            dispatch(allCourseSuccess(data));
        } catch (error) {
            dispatch(courseFailure(error.message));
        }
    };

    const getAllTeachersFunc = async () => {
        try {
            dispatch(teacherStart());
            const { data } = await AuthService.getAllTeachers();
            dispatch(allTeacherSuccess(data));
        } catch (error) {
            dispatch(teacherFailure(error.message));
        }
    };

    const getAllRoomsFunc = async () => {
        try {
            dispatch(roomStart());
            const { data } = await AuthService.getAllRooms();
            dispatch(allRoomSuccess(data));
        } catch (error) {
            dispatch(roomFailure(error.message));
        }
    };

    useEffect(() => {
        getAllGroupsFunc();
        getAllCoursesFunc();
        getAllTeachersFunc();
        getAllRoomsFunc();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Guruhlarni filterlash funksiyasi
    const filteredGroups = groups.filter(group => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === "") return true;

            if (key === "teacher") {
                return `${group[key].first_name} ${group[key].last_name}` === value;
            }

            if (key === "course") {
                return group[key].title === value;
            }

            if (key === "day") {
                return group[key] === value;
            }

            if (key === 'start_date' || key === 'end_date') {
                const groupStartDate = new Date(group['start_date']);
                const groupEndDate = new Date(group['end_date']);
                const filterStartDate = new Date(filters['start_date']);
                const filterEndDate = new Date(filters['end_date']);

                if (filters['start_date'] && filters['end_date']) {
                    return groupStartDate >= filterStartDate && groupEndDate <= filterEndDate;
                }
                else if (filters['start_date']) {
                    return groupStartDate >= filterStartDate;
                }
                else if (filters['end_date']) {
                    return groupEndDate <= filterEndDate;
                }
                else {
                    return true;
                }
            }


            return group[key] === value;
        });
    });

    // Tasodifiy ranglarni generatsiya qiladigan funksiya
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewGroup({
            name: "",
            course: "",
            teacher: "",
            day: "",
            room: "",
            start_time: "",
            start_date: "",
            end_date: "",
        });
        setModals({
            modal: false,
            more: null,
        });
    };

    const openModal = (id) => {
        setNewGroup(groups.filter(group => group._id === id)[0]);
        handleModal("modal", true);
    };

    // Guruh tugash sanasini kurs davomiyligiga ko'ra hisoblash
    const selectedCourse = courses.find(course => course._id === newGroup.course);
    const startDate = new Date(newGroup.start_date);
    let endDate = null;
    if (newGroup.start_date !== "" && selectedCourse) {
        const endMonth = startDate.getMonth() + selectedCourse.course_duration;
        const endYear = startDate.getFullYear() + Math.floor(endMonth / 12);
        const endDay = new Date(endYear, endMonth % 12, startDate.getDate());
        endDate = `${endYear}-${(endMonth % 12 + 1).toString().padStart(2, '0')}-${endDay.getDate().toString().padStart(2, '0')}`;
    }

    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        if (
            newGroup.name !== "" &&
            newGroup.course !== "" &&
            newGroup.day !== "" &&
            newGroup.room !== "" &&
            newGroup.start_time !== "" &&
            newGroup.start_date !== ""
        ) {
            try {
                dispatch(groupStart());
                if (!newGroup._id) {
                    const { data } = await AuthService.addNewGroup({ ...newGroup, end_date: endDate, color: getRandomColor() });
                    getAllGroupsFunc();
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } else {
                    const { _id, __v, color, students, createdAt, updatedAt, ...updatedGroupCred } = newGroup;
                    const { data } = await AuthService.updateGroup(newGroup._id, updatedGroupCred);
                    dispatch(getGroupSuccess(data));
                    getAllGroupsFunc();
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                }
            } catch (error) {
                dispatch(groupFailure(error.response?.data.message));
                await ToastLeft.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message
                });
            }
        }
        else {
            await ToastLeft.fire({
                icon: "error",
                title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
            });
        }
    };

    const deleteHandler = async (id) => {
        Swal.fire({
            title: "Ishonchingiz komilmi?",
            text: "Buni qaytara olmaysiz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Yo'q",
            confirmButtonText: "Ha, albatta!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(groupStart());
                AuthService.deleteGroup(id).then((res) => {
                    getAllGroupsFunc();
                    Toast.fire({
                        icon: "success",
                        title: res?.data.message
                    });
                }).catch((error) => {
                    dispatch(groupFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    return (
        <div className="students container" onClick={() => handleModal("more", null)}>
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-2xl">Guruhlar</h1>
                    <p>
                        <span>Miqdor</span>
                        <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span>
                        <span>{groups?.length}</span>
                    </p>
                </div>
                <button
                    onClick={() => handleModal("modal", true)}
                    className="global_add_btn">
                    Yangisini qo'shish
                </button>
            </div>

            <div className="flex items-center flex-wrap gap-4 py-8">
                {/* Teachers */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="teacher"
                        className="absolute text-xs bg-white -top-1.5 left-3">
                        <span>O'qituvchi</span>
                    </label>
                    <select
                        value={filters.teacher}
                        onChange={handleFilterChange}
                        name="teacher"
                        id="teacher"
                        className="w-full p-2 text-sm rounded border outline-cyan-600">
                        <option
                            value=""
                            className="text-sm italic">
                            None
                        </option>
                        {
                            teachers.map(teacher => (
                                <option
                                    key={teacher._id}
                                    value={`${teacher.first_name} ${teacher.last_name}`}
                                    className="text-sm">
                                    {teacher?.first_name} {teacher?.last_name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Courses */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="course"
                        className="absolute text-xs bg-white -top-1.5 left-3">
                        <span>Kurslar</span>
                    </label>
                    <select
                        value={filters.course}
                        onChange={handleFilterChange}
                        name="course"
                        id="course"
                        className="w-full p-2 text-sm rounded border outline-cyan-600">
                        <option
                            value=""
                            className="text-sm italic">
                            None
                        </option>
                        {
                            courses.map(course => (
                                <option
                                    key={course._id}
                                    value={course?.title}
                                    className="text-sm">
                                    {course?.title}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Days */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="day"
                        className="absolute text-xs bg-white -top-1.5 left-3">
                        <span>Kunlar</span>
                    </label>
                    <select
                        value={filters.day}
                        onChange={handleFilterChange}
                        name="day"
                        id="day"
                        className="w-full p-2 text-sm rounded border outline-cyan-600">
                        <option
                            value=""
                            className="text-sm italic">
                            None
                        </option>
                        {
                            days.map((day, index) => (
                                <option value={day} key={index}>{day}</option>
                            ))
                        }
                    </select>
                </div>

                {/* Start Date */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="start_date"
                        className="absolute text-xs bg-white -top-1.5 left-3">
                        <span>Boshlanish</span>
                    </label>
                    <input
                        value={filters.start_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="start_date"
                        id="start_date"
                        className="w-full p-1.5 text-sm rounded border outline-cyan-600" />
                </div>

                {/* End Date */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="end_date"
                        className="absolute text-xs bg-white -top-1.5 left-3">
                        <span>Tugash</span>
                    </label>
                    <input
                        value={filters.end_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="end_date"
                        id="end_date"
                        className="w-full p-1.5 text-sm rounded border outline-cyan-600" />
                </div>

                {/* Clear Filter */}
                <button onClick={() => setFilters({ teacher: "", course: "", day: "", start_date: "", end_date: "" })} className="border rounded p-2 text-sm text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-500 transition-all">Filterni tiklash</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full mt-4">
                    <thead>
                        <tr className="font-semibold text-xs flex justify-between text-left px-4">
                            <th className="w-[130px] text-left">Guruh</th>
                            <th className="w-[200px] text-left">Kurslar</th>
                            <th className="w-[270px] text-left">O'qituvchi</th>
                            <th className="w-[130px] text-left">Kunlar</th>
                            <th className="w-[130px] text-left">Sanalar</th>
                            <th className="w-[100px] text-left">Xonalar</th>
                            <th className="w-[80px] text-left">Talabalar</th>
                            <th className="w-[80px] text-center">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="grid grid-cols-1 2xsm:gap-4 py-4">
                        {isLoading ? <>
                            <tr className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                                <td className="w-[85%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[50%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[65%] h-4 rounded bg-gray-300"></td>
                            </tr>
                        </> : filteredGroups.length > 0 ?
                            filteredGroups.map((group, index) => (
                                <tr
                                    onClick={() => navigate(`/admin/group-info/${group._id}`)}
                                    key={index}
                                    className="2xsm:w-full flex items-center justify-between capitalize text-sm border rounded-lg px-4 py-3 cursor-pointer hover:shadow-md transition-all">
                                    <td className="w-[130px] text-left">{group.name}</td>
                                    <td className="w-[200px] text-left text-xs">{group.course?.title}</td>
                                    <td className="w-[270px] text-left">{group.teacher?.first_name} {group.teacher?.last_name}</td>
                                    <td className="w-[130px] text-left text-xs">
                                        <div>
                                            <h1>{group.day}</h1>
                                            <h1>{group.start_time}</h1>
                                        </div>
                                    </td>
                                    <td className="w-[130px] text-left text-xs">
                                        <div>
                                            <h1 className="flex items-center gap-1">
                                                {group.start_date}
                                                <GoHorizontalRule />
                                            </h1>
                                            <h1>{group.end_date}</h1>
                                        </div>
                                    </td>
                                    <td className="w-[100px] text-left text-xs">{group.room.name}</td>
                                    <td className="w-[80px] text-center">{group.students.length}</td>
                                    <td className="w-[80px] flex justify-center gap-8">
                                        {/* more button */}
                                        <div onClick={(e) => {
                                            e.stopPropagation()
                                            handleModal("more", group._id)
                                        }} className="relative cursor-pointer text-cyan-600 text-xl">
                                            <IoMdMore />
                                            {/* more btn modal */}
                                            <div className={`${modals.more === group._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                                <button onClick={() => openModal(group._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"><LiaEditSolid />Tahrirlash</button>
                                                <button onClick={() => deleteHandler(group._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"><RiDeleteBin7Line />O'chirish</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr><td>Ma'lumot topilmadi</td></tr>
                        }
                    </tbody>
                </table>
            </div>

            {/* create and update group modal */}
            <GroupModal
                modals={modals}
                newGroup={newGroup}
                setNewGroup={setNewGroup}
                handleCreateAndUpdate={handleCreateAndUpdate}
                courses={courses}
                teachers={teachers}
                rooms={rooms}
                clearModal={clearModal}
                isLoading={isLoading}
            />
        </div>
    )
}

export default Groups
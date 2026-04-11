import { useState } from "react";
import Modal from "../../components/CustomModal";
import { TbEditCircle } from "react-icons/tb";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile, setUpdated } from "../../redux/user/userSlice";
import { useForm } from "react-hook-form";

const ProfileEdit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { username, email, phoneNumber, adress, _id } = currentUser || {};

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const editProfileData = async (data, id) => {
    try {
      if (data && id) {
        const formData = data;
        dispatch(editUserProfile({ ...formData }));
        await fetch(`/api/user/editUserProfile/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData }),
        });
        dispatch(setUpdated(true));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <button 
        type="button" 
        className="flex h-8 w-8 items-center justify-center text-white bg-emerald-500 rounded-full hover:bg-emerald-400 transition-colors shadow-lg" 
        onClick={() => setIsModalOpen(true)}
      >
        <TbEditCircle size={18} />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="bg-slate-900 border border-white/10 rounded-3xl max-w-[500px] w-full p-0 overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        <form onSubmit={handleSubmit((data) => editProfileData(data, _id))}>
          <div className="p-8">
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Edit Profile</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Update your personal details</p>

            <div className="flex flex-col gap-6">
              <TextField
                id="username"
                label="Full Name"
                variant="outlined"
                fullWidth
                {...register("username")}
                defaultValue={username}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />

              <TextField
                id="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                defaultValue={email}
                {...register("email")}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />
              <TextField
                id="phoneNumber"
                label="Phone Number"
                type="text"
                variant="outlined"
                fullWidth
                defaultValue={phoneNumber}
                {...register("phoneNumber")}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />

              <TextField
                id="adress"
                label="Living Address"
                multiline
                rows={3}
                fullWidth
                defaultValue={adress}
                {...register("adress")}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />
            </div>

            <div className="mt-10 flex justify-end items-center gap-3">
              <button
                type="button"
                className="rounded-xl px-6 py-3 text-sm font-bold text-slate-400 hover:bg-white/5 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95"
                onClick={() => setIsModalOpen(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileEdit;

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Onboarding = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onOpenChange(false);
    navigate("/sign-up");
  };

  const handleSignIn = () => {
    onOpenChange(false);
    navigate("/sign-in");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`
          w-full !max-w-[98vw] sm:!w-[700px] md:!w-[800px] lg:!w-[900px] !max-w-4xl
          rounded-xl border-none
          bg-gradient-to-br from-[#892727] to-[#6b1d1d]
          shadow-2xl
          px-4 py-10 md:px-0 md:py-0
          flex items-center justify-center
        `}
      >
        <Card className="rounded-3xl border-none bg-transparent shadow-none w-full p-0">
          <CardContent className="flex flex-col items-center w-full px-0 py-14 md:py-24">
            <h1 className="text-white text-center text-4xl md:text-5xl font-extrabold leading-tight mb-12 md:mb-12">
              Start listening with a free<br />
              Rhythm account
            </h1>
            <Button
              className="bg-[#1fdf64] hover:bg-[#1fdf64] text-black text-2xl font-bold px-10 md:px-16 py-5 md:py-6 rounded-full mb-10 md:mb-10 shadow-none transition-none focus:ring-0 cursor-pointer"
              style={{ boxShadow: "none" }}
              onClick={handleSignUp}
            >
              Sign up free
            </Button>
            <div className="flex flex-col items-center gap-3 mb-10">
              <span className="text-zinc-200 text-lg md:text-xl font-normal flex flex-row gap-2">
                Already have an account?
                <button
                  type="button"
                  className="text-white cursor-pointer underline font-semibold ml-2 hover:text-white bg-transparent border-none outline-none"
                  onClick={handleSignIn}
                  style={{ cursor: "pointer" }}
                >
                  Log in
                </button>
              </span>
            </div>
          </CardContent>
          <div className="absolute left-0 right-0 bottom-0 h-20 md:h-24 bg-[#561919] bg-opacity-85 rounded-b-xl pointer-events-none" />
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;

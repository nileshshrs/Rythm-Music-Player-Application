import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Onboarding = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="max-w-2xl rounded-3xl border-none p-0 bg-gradient-to-br from-[#842020] to-[#4a1414] shadow-2xl overflow-hidden"
      style={{ boxShadow: "0 10px 40px 0 rgba(0,0,0,0.40)" }}
    >
      <Card className="rounded-3xl border-none bg-transparent shadow-none p-0">
        <CardContent className="flex flex-col items-center w-full p-0">
          <h1 className="text-white text-center text-5xl md:text-6xl font-extrabold leading-tight mb-16">
            Start listening with a free<br />
            Rhythm account
          </h1>
          <Button
            asChild
            className="bg-[#1fdf64] hover:bg-[#1fdf64] text-black text-2xl font-bold px-16 py-6 rounded-full shadow-none mb-12 transition-none focus:ring-0"
            style={{ boxShadow: "none" }}
          >
            <Link to="/sign-up">Sign up free</Link>
          </Button>
          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-200 text-xl md:text-2xl font-medium">
              Already have an account?
              <Link
                to="/sign-in"
                className="text-white underline font-semibold ml-4 hover:text-white"
              >
                Log in
              </Link>
            </span>
          </div>
        </CardContent>
        <div className="absolute left-0 right-0 bottom-0 h-24 bg-[#471717] bg-opacity-80 rounded-b-3xl pointer-events-none" />
      </Card>
    </DialogContent>
  </Dialog>
);

export default Onboarding;

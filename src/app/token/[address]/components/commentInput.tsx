import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { useAuth } from "@/providers/Auth";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CommentInput() {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { address } = useParams() as { address: string };
  const { isAuthenticated } = useAuth();
  const saveComment = async () => {
    if (!isAuthenticated) return toast.error("Please connect wallet");
    try {
      setLoading(true);
      await api.post("/v1/comment/add", {
        comment,
        coinId: address,
      });
      setOpen(false);
      setComment("");
      setLoading(false);
    } catch (e: any) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Post Reply</Button>
      <Dialog open={open} onOpenChange={(value: boolean) => setOpen(value)}>
        <DialogContent className="sm:max-w-[425px] bg-baseSecondary border-none">
          <DialogHeader>
            <DialogTitle>Add a comment</DialogTitle>
          </DialogHeader>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            loading={loading}
            loadingText="Posing..."
            onClick={saveComment}
            className="w-full"
            type="button"
          >
            Post Reply
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InfiniteScrollTriggerProps = {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
};

export const InfiniteScrollTrigger = ({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  loadMoreText = "Load more",
  noMoreText = "No more items",
  className,
  ref,
}: InfiniteScrollTriggerProps) => {
  let text = loadMoreText;

  if (isLoadingMore) {
    text = "Loading...";
  }

  if (!canLoadMore) {
    text = noMoreText;
  }

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      ref={ref}
    >
      <Button
        disabled={!canLoadMore || isLoadingMore}
        onClick={onLoadMore}
        size="sm"
        variant="ghost"
      >
        {text}
      </Button>
    </div>
  );
};

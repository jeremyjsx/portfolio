import "./cli-loop.css";

export function WorkflowsCliLoop() {
  return (
    <figure className="workflows-cli-loop">
      <div className="workflows-cli-loop__frame">
        <video
          className="workflows-cli-loop__video"
          src="/images/projects/workflows-cli-loop.mp4"
          controls
          playsInline
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <figcaption className="workflows-cli-loop__caption">
        validate → run in the terminal. Clip from the wallbit-workflows demo.
      </figcaption>
    </figure>
  );
}

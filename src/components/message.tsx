import { formatRelative, formatDistance, differenceInHours } from "date-fns";
import { PostProps } from "../../utils/types";
import { ProfProps } from "../../utils/types";

export const Message = ({ node, func }: ProfProps) => {
  const session = localStorage.getItem("id");
  return (
    <div
      className={`flex flex-col relative space-x-1 space-y-1 ${
        node.developer.id === session ? "text-right" : "text-left"
      }
        `}
    >
      <div
        className={`flex relative space-x-1 ${
          node.developer.id === session
            ? "flex-row-reverse space-x-reverse"
            : "flex-row"
        }`}
      >
        {/* {profile.username && profile.emoji && (
          <div className="w-12 h-12 overflow-hidden flex-shrink-0 rounded">
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
             {profile.emoji}
            </a>
          </div>
        )} */}
        <span
          className={`flex relative flex-col rounded space-x-2 items-start p-3 text-white ${
            node.developer.id === session ? "bg-[#4a9c6d]" : "bg-[#363739]"
          } `}
        >
          <div className="font-bold">{node.developer.id}&nbsp;</div>

          <div className="max-w-sm text-left mt-2">
            <div>
              {node.languages.JavaScript != null &&
                "JavaScript: " + node.languages.JavaScript}{" "}
            </div>
            <div>
              {node.languages.Python !== null &&
                "Python: " + node.languages.Python}
            </div>
            <div>
              {node.languages.Rust !== null && "Rust: " + node.languages.Rust}
            </div>
            <div>
              {node.languages.Java !== null && "Java: " + node.languages.Java}
            </div>
            <div>
              {node.languages.Swift !== null &&
                "Swift: " + node.languages.Swift}
            </div>
            <div>
              {node.languages.Go !== null && "Go: " + node.languages.Go}
            </div>
            <div>
              {node.languages.Cpp !== null && "Cpp: " + node.languages.Cpp}
            </div>
            <div>
              {node.languages.Scala !== null &&
                "Scala: " + node.languages.Scala}
            </div>
            <div>
              {node.languages.WebAssembly !== null &&
                "WebAssembly: " + node.languages.WebAssembly}
            </div>
            <div>
              {node.languages.Solidity !== null &&
                "Solidity: " + node.languages.Solidity}
            </div>
            <div>
              {node.languages.Other !== null &&
                "Other: " + node.languages.Other}
            </div>
          </div>
          <button
            className="mt-5 bg-transparent hover:bg-gray-500 text-white-900 font-semibold hover:text-white py-2 px-4 border border-white-900 hover:border-transparent rounded"
            onClick={() => func(node.id)}
          >
            Attest to Profile
          </button>
        </span>
      </div>
      <div className="text-sm text-gray-400">
        <p> Attestations: {node.attestations.length}</p>
      </div>
    </div>
  );
};

import { ProfProps } from "@/types";

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
            Verify Profile
          </button>
        </span>
      </div>
      <div className="text-sm text-gray-400">
        <p>
          {" "}
          Unique Verifications:{" "}
          {
            node.attestations
              .map((attestation) => attestation.attester.id)
              .filter((value, index, self) => self.indexOf(value) === index)
              .length
          }
        </p>
      </div>
    </div>
  );
};

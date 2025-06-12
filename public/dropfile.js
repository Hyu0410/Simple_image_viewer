document.addEventListener("DOMContentLoaded", () => {
  const dropFile = {
    filesList: [],

    handleFiles(files) {
      // 새로 선택된 파일들을 배열로 변환 후 기존 배열에 추가
      this.filesList = this.filesList.concat(Array.from(files));

      this.renderFiles();
    },

    removeFile(index) {
      this.filesList.splice(index, 1);
      this.renderFiles();
    },

    renderFiles() {
      const filesContainer = document.getElementById("files");
      filesContainer.innerHTML = "";

      this.filesList.forEach((file, index) => {
        const fileDiv = document.createElement("div");
        fileDiv.classList.add("file");

        const thumbDiv = document.createElement("div");
        thumbDiv.classList.add("thumbnail");

        if (file.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.classList.add("image");
          img.src = URL.createObjectURL(file);
          thumbDiv.appendChild(img);
        } else {
          const icon = document.createElement("img");
          icon.classList.add("image");
          icon.src = "https://img.icons8.com/pastel-glyph/2x/document.png";
          thumbDiv.appendChild(icon);
        }

        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("details");

        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");

        const nameDiv = document.createElement("div");
        nameDiv.classList.add("name");
        nameDiv.textContent = file.name;

        const sizeDiv = document.createElement("div");
        sizeDiv.classList.add("size");
        sizeDiv.textContent = (file.size / 1024 / 1024).toFixed(2) + " MB";

        headerDiv.appendChild(nameDiv);
        headerDiv.appendChild(sizeDiv);

        detailsDiv.appendChild(headerDiv);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "삭제";
        deleteBtn.onclick = () => {
          this.removeFile(index);
        };

        fileDiv.appendChild(thumbDiv);
        fileDiv.appendChild(detailsDiv);
        fileDiv.appendChild(deleteBtn);

        filesContainer.appendChild(fileDiv);
      });
    },
  };

  window.dropFile = dropFile;

  // 드래그앤드롭 이벤트 추가
  const dropArea = document.getElementById("drop-file");

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("dragover"); // 필요하면 스타일 추가 가능
  });

  dropArea.addEventListener("dragleave", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");
  });

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");

    const droppedFiles = event.dataTransfer.files;
    dropFile.handleFiles(droppedFiles);
  });

  document.getElementById("calculateBtn").addEventListener("click", () => {
    if (dropFile.filesList.length < 1) {
      alert("파일을 업로드해주세요.");
      return;
    }

    const formData = new FormData();
    dropFile.filesList.forEach((file, index) => {
    formData.append(`file${index}`, file);
    });

    fetch("/upload-344912371038", {
      method: "POST",
      body: formData,
    })
    .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.json();
    })
    .then((data) => {
        alert(data.message);
        // imageUrls.forEach(url => {
        //     const img = document.createElement("img");
        //     img.src = url;
        //     document.body.appendChild(img);
        // });
    })
    .catch((err) => {
        console.error("업로드 실패", err);
        alert("업로드 중 오류가 발생했습니다.");
    });
  });
});

// Mảng dùng để lưu danh sách task sau khi đọc từ data.json
let tasks = [];

// Lấy các phần tử HTML cần dùng
const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const priority = document.getElementById("priority");
const messageBox = document.getElementById("messageBox");
const taskNameError = document.getElementById("taskNameError");

// Khi trang load xong thì gọi hàm đọc dữ liệu
document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
});

/*
  loadTasks()
  - Dùng fetch để đọc file data.json
  - Nếu đọc thành công thì gán dữ liệu vào biến tasks
  - Sau đó gọi renderTasks() để hiển thị
*/
function loadTasks() {
  fetch("data.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Không đọc được file data.json");
      }
      return response.json();
    })
    .then(function (data) {
      tasks = data;
      renderTasks();
    })
    .catch(function (error) {
      messageBox.innerHTML =
        '<div class="alert alert-danger">Không đọc được file data.json</div>';
      console.log(error);
    });
}

/*
  getPriorityBadge(priorityValue)
  - Trả về class theo mức độ ưu tiên
  - High   -> đỏ
  - Medium -> vàng
  - Low    -> xanh
*/
function getPriorityBadge(priorityValue) {
  if (priorityValue === "High") {
    return "bg-danger";
  }

  if (priorityValue === "Medium") {
    return "bg-warning text-dark";
  }

  return "bg-success";
}

/*
  renderTasks()
  - Duyệt mảng tasks
  - Tạo HTML cho từng task
  - Hiển thị ra div taskList
*/
function renderTasks() {
  let html = "";

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="mb-0">Chưa có task nào</p>';
    return;
  }

  for (let i = 0; i < tasks.length; i++) {
    let badgeClass = getPriorityBadge(tasks[i].priority);

    html += `
      <div class="bg-white border rounded-3 p-3 mb-3 shadow-sm">
        <div class="row align-items-center">
          <div class="col-md-6 mb-3 mb-md-0">
            <div class="text-secondary small">Task</div>
            <div class="fs-5">${tasks[i].name}</div>
          </div>

          <div class="col-6 col-md-3">
            <div class="text-secondary small">Priority</div>
            <span class="badge ${badgeClass}">${tasks[i].priority}</span>
          </div>

          <div class="col-6 col-md-3 text-md-end">
            <div class="text-secondary small">Action</div>
            <button class="btn btn-sm btn-outline-danger mt-1" onclick="deleteTask(${tasks[i].id})">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  taskList.innerHTML = html;
}

/*
  validateTaskName(nameValue)
  - Kiểm tra tên task có rỗng không
  - Kiểm tra tên task có quá 100 ký tự không
  - Nếu lỗi thì trả về nội dung lỗi
  - Nếu hợp lệ thì trả về chuỗi rỗng
*/
function validateTaskName(nameValue) {
  if (nameValue === "") {
    return "Task Name không được để trống";
  }

  if (nameValue.length > 100) {
    return "Task Name không được quá 100 ký tự";
  }

  return "";
}

/*
  showMessage(message, type)
  - Hiển thị thông báo thành công hoặc lỗi
  - type thường là success hoặc danger
*/
function showMessage(message, type) {
  messageBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

/*
  clearMessage()
  - Xóa thông báo phía trên danh sách
*/
function clearMessage() {
  messageBox.innerHTML = "";
}

/*
  clearError()
  - Xóa lỗi dưới ô input Task Name
*/
function clearError() {
  taskNameError.innerHTML = "";
}

/*
  Bắt sự kiện submit form
  - Không cho load lại trang
  - Kiểm tra dữ liệu nhập vào
  - Nếu hợp lệ thì thêm task mới vào mảng
  - Sau đó render lại danh sách
*/
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  clearError();
  clearMessage();

  let nameValue = taskName.value.trim();
  let priorityValue = priority.value;

  let error = validateTaskName(nameValue);

  if (error !== "") {
    taskNameError.innerHTML = error;
    showMessage(error, "danger");
    return;
  }

  let newTask = {
    id: Date.now(),
    name: nameValue,
    priority: priorityValue
  };

  tasks.push(newTask);

  renderTasks();
  showMessage("Thêm task thành công", "success");

  taskForm.reset();
});

/*
  deleteTask(id)
  - Nhận vào id của task cần xóa
  - Lọc lại mảng, bỏ task có id đó
  - Hiển thị lại danh sách sau khi xóa
*/
function deleteTask(id) {
  let confirmDelete = confirm("Bạn có muốn xóa task này không?");

  if (!confirmDelete) {
    return;
  }

  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  renderTasks();
  showMessage("Xóa task thành công", "success");
}
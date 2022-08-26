class EmployeePage {

    search = " ";
    positionID = " ";
    departmentID = " ";
    FormMode = Enumeration.FormMode.Add;
    isDelete = false;
    isDuplicate = false;
    empNumbershow = 10;
    sortName = "employeeCode";
    isSort = true;
    // Hàm khởi tạo
    constructor(gridId) {
        let me = this;
        me.grid = $(`#${gridId}`);
        me.setupEvents();
        me.getData();


    }
    /*
     * Hàm dùng để  lấy các dữ liệu  
     * PCTUANANH( 14/07/2022)
     */
    getData() {
        let me = this;
        me.getEmployees();
        me.getPositions();
        me.getDepartments();
        me.isDelete == false;
        me.isDuplicate == false;


    }
    /*
     * Hàm dùng  gọi đến các sự kiện 
     * PCTUANANH( 14/07/2022)
     */
    setupEvents() {
        let me = this;
        // Xử lý tìm kiêm, lọc nhân viên 
        me.filterEmployee();
        // Khi dbl click vào dòng thì sẽ hiển thị from để sửa
        me.openFormEdit();
        // Bấm button thêm mới thì hiển thị From chi tiết nhân viên 
        me.addEmployee()
        // Khởi tạo sự kiện khi click vào dòng sẽ thay đổi backGrourd
        me.clickTrBackgr();
        //Xử lý đóng form
        me.closeFrom();
        // Xử lý lưu form
        me.saveForm();
        //Xử lý xoá Employee
        me.deleteTrEmployee()
        //Xử lý Duplicate Employee
        me.duplicateEmployee();
        //  Xử lý Khi load lại trang
        me.refreshPage();
        //  Xử lý Khi sắp xếp Employee
        // me.sortEmployee()
        //Format tiền lương khi nhập vào
        me.formatMoneyInput();
         //Format số điện thoại khi nhập vào
        me.formatPhoneInput();

    }
    /*
     * Hàm dùng để lấy dữ liệu employee
     * PCTUANANH( 14/07/2022)
     */

    getEmployees() {
        let me = this;
        me.search = me.search.trim();
        let sortOrderby = me.isSort ? "DESC" : "ASC";
        let sort = `${me.sortName} ${sortOrderby}`;
        const url = `http://localhost:5108/api/v1/Employees?pageSize=${me.empNumbershow}&pageNumber=1&search=${me.search}&positionID=${me.positionID}&departmentID=${me.departmentID}&sort=${sort}`
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (res) {

                var employees = res.data;
                me.renderEmployees(employees);

            }
        });
    }

    /*
     * Hàm dùng để  hiển thị danh sách employee
     * PCTUANANH( 14/07/2022)
     */
    renderEmployees(data) {
        $("#table-employee tbody").empty();
        for (let emp of data) {
            let genderstring = "gd" + emp.gender;
            let gender = Enumeration.gender[genderstring];
            const dateOfBirth = CommonFn.formatDate(emp.dateOfBirth);
            const salary = CommonFn.formatMoney(emp.salary);
            let workStatusstring = "ws" + emp.workStatus;
            let workStatus = Enumeration.workStatus[workStatusstring];

            var trHTML = $(
                `<tr>
                <td>
                ${emp.employeeCode}
                </td>
                <td>${emp.employeeName}</td>
                <td>${gender}</td>
                <td class="align-center">${dateOfBirth}</td>
                <td>${emp.phoneNumber}</td>
                <td>${emp.email}</td>
                <td>${emp.positionName}</td>
                <td>${emp.departmentName}</td>
                <td class="align-right">${salary}</td>
                <td>${workStatus}</td>
       
                </tr>
                `
            )
            $(trHTML).data('emp', emp);
            $(trHTML).data('id', emp.employeeID);
            $("#table-employee tbody").append(trHTML);
        };
    }
    /*
     * Hàm dùng để lấy dữ liệu các phòng ban
     * PCTUANANH( 14/07/2022)
     */

    getDepartments() {
        let me = this;
        const url = "http://localhost:5108/api/v1/Departments";
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (response) {
                me.renderDepartments(response);
            }
        });
    }
    /*
     * Hàm dùng để  hiển thị list danh sách các phòng ban
     * PCTUANANH( 14/07/2022)
     */
    renderDepartments(departments) {

        for (let dep of departments) {
            $(".list-departments").append(
                ` <option value="${dep.departmentID}">${dep.departmentName}</option>`
            )
        }

    };
    /*
     * Hàm dùng để lấy dữ liệu các vị trí
     * PCTUANANH( 14/07/2022)
     */
    getPositions() {
        let me = this;
        const url = "http://localhost:5108/api/v1/Positions";
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (response) {
                me.rendePositions(response);
            }
        });
    }
    /*
     * Hàm dùng để  hiển thị list danh sách các vị trí
     * PCTUANANH( 14/07/2022)
     */
    rendePositions(positions) {
        for (let pos of positions) {
            $(".list-positions").append(
                ` <option value="${pos.positionID}">${pos.positionName}</option>`
            )
        }

    };
    /*
     * Hàm dùng để  sử lý tìm kiếm theo họ và tên, số điện thoại, mã nhân viên, lọc theo phòng ban vị trí
     * PCTUANANH( 14/07/2022)
     */
    filterEmployee() {
        let me = this;
        //Xử lý sự kiện tìm kiếm tên ,số điện thoại , mã nhân viên 
        $("#search").on('keypress', function (e) {
            if (e.which == 13) {
                me.search = $("#search").val();
                me.getEmployees();

            }
        });
        //Xử lý sự kiện tìm kiếm tên ,số điện thoại , mã nhân viên 
        $("#search").on('input',function (e) {           
            me.search = $("#search").val();
            me.getEmployees();
            
        });
        
        //Xử lý sự kiện lọc theo phòng ban  
        $("#department-filter").on("click", function (e) {
            me.departmentID = $("#department-filter").val();
            me.getEmployees();
        })
        //Xử lý sự kiện lọc theo vị trí 
        $("#position-filter").on("click", function (e) {
            me.positionID = $("#position-filter").val();
            me.getEmployees();
        })
        //Xử lý lọc theo số nhân viên trên trang
        $("#select-Nub-emp").on("click", function (e) {
            me.empNumbershow = $("#select-Nub-emp").val();
            me.getEmployees();
        })
    }
    /*
     * Hàm dùng để  bắt sự kiện khi cick vào dòng  để đổi background
     * PCTUANANH( 14/07/2022)
     */
    clickTrBackgr() {
        let me = this;
        me.grid.off("click", " tbody tr");
        me.grid.on("click", " tbody tr", function (e) {
            e.preventDefault();
            me.grid.find(".tr-active").removeClass("tr-active");
            $(this).addClass("tr-active");
        });
    }

    /*
     * Hàm dùng để  sử lý mở FormEdit
     * PCTUANANH( 14/07/2022)
     */
    openFormEdit() {
        let me = this;
        me.grid.off("dblclick", "tbody tr");
        me.grid.on("dblclick", "tbody tr", function () {
            me.FormMode = Enumeration.FormMode.Edit;
            $(".input-show-error").hide();
            $("input").removeClass("input-error");
            var employee = $(this).data().emp;
            let id = $(this).data().id;
            var inputs = $("[propName]");
            for (let input of inputs) {
                let propName = $(input).attr("propName");
                let value = employee[propName];
                if ($(input).attr("typeDate")) {
                    value = CommonFn.formatDate2(value);

                }
                if (propName === "salary") {
                    value = CommonFn.formatMoney(value);
                }
                $(input).val(value);
            }
            //Xử lý forcus vào input đàu tiên 

            $("#form-detail").show();
            me.focusInput();



        });
    }
    /*
     * Hàm dùng để  bắt sự kiện thêm nhân viên mới
     * PCTUANANH( 14/07/2022)
     */
    addEmployee() {
        let me = this;

        $(document).off("click", "#bnt-add");
        $(document).on("click", "#bnt-add", function (e) {
            me.FormMode = Enumeration.FormMode.Add;
            e.preventDefault();
            $("input[propName]").val("");
            $("select[propName]").val("");
            $("input").removeClass("input-error");
            $("#form-detail").show();
            //Xử lý forcus vào input đàu tiên 
            me.focusInput();
            me.insertNewCode();
          

        });
    }
    /*
     * Hàm dùng để xử lý forcous vào Input Đầu tiên khi thêm mới, Edit,dulicate
     * PCTUANANH( 14/07/2022)
     */
    focusInput() {
        $("#employeeCode").focus();
       
    }
     /*
     * Hàm dùng để xử lý nhập lương vào sẽ thay tự động thay đổi theo định dạng vD: 1000.000đ
     * PCTUANANH( 14/07/2022)
     */
     formatMoneyInput() {
            $("#salary").change(function (e) { 
                let money = $("#salary").val() ;
                money = CommonFn.formatMoneyInt(money);
                
               money =  CommonFn.formatMoney(money);
                $("#salary").val( money);
            });
            
            
    }
     /*
     * Hàm dùng để xử lý nhập số điện  vào sẽ thay tự động thay đổi theo định dạng vD: 098 7654321
     * PCTUANANH( 14/07/2022)
     */
    formatPhoneInput() {
        $("#phoneNub").focusout(function (e) { 
            if($("#phoneNub").val()){
                let phone = $("#phoneNub").val() ; 
                phone = CommonFn.formatPhone(phone);
                $("#phoneNub").val(phone);
            }
           
        });
        
}
    /*
     * Hàm dùng để gán NewCode vào ô mã nhân viên mới khi bấn vào thêm mới,dulicate
     * PCTUANANH( 14/07/2022)
     */
    insertNewCode() {
        let me = this;
        const url = "http://localhost:5108/api/v1/Employees/new-code";
        $.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            success: function (response) {
                $("#employeeCode").val(response);
            }
        });


    }

    /*
     * Hàm dùng để  validateForm
     * PCTUANANH( 14/07/2022)
     */
    validateForm() {
        let me = this,
            isValid = true;
        var vailds = $('[Required]')
        for (let vaild of vailds) {
            let value = $(vaild).val();
            let idShowErr = $(vaild).attr("idShowErr");

            if (!value) {
                isValid = false;
                $(vaild).addClass("input-error");
                $(`#${idShowErr}`).show();

            } else {
                $(vaild).removeClass("input-error");
                $(`#${idShowErr}`).hide();
            }


        }

        $("[Required]").focusout(function (e) {
            e.preventDefault();
            if ($(this).val()) {
                $(this).removeClass("input-error");
                let idShowErr = $(this).attr("idShowErr");
                $(`#${idShowErr}`).hide();
            }

        });
        //  Kiểm tra xem trường input nào chưa validate thì focus vào
        for (let vaild of vailds) {
            if (!$(vaild).val()) {
                $(vaild).focus();
                return;
            }

        }


    }
    /*
     * Hàm dùng  validateForm từ backend
     * PCTUANANH( 17/07/2022)
     */
    vaildFormBE(response) {
        if (response.status == "400") {
            $("#vaild-form-content").empty();
            var errorHTML = ``;

            if (response.responseJSON.errors) {
                if (response.responseJSON.errors.Email == 'e009') {

                    errorHTML += `<div class="vaild-form-item">Email không đúng định dạng, định dạng ....@example.com</div>`;

                }
            }
            if (response.responseJSON.messageCode == "e003") {
                errorHTML += `<div class="vaild-form-item">Mã nhân viên không được trùng nhau</div>`;

            }
            if (errorHTML) {
                $("#vaild-form").show();
                $("#vaild-form-content").append(errorHTML);
            }


        }
    }

    /*
     * Hàm dùng để  sử lý đóng form, huỷ form
     * PCTUANANH( 14/07/2022)
     */
    closeFrom() {
        let me = this;
        //  Bấm button đóng thì ẩn  From chi tiết nhân viên 
        $("#bnt-close").click(function (e) {
            e.preventDefault();
            $("#form-detail").hide();
            $("[Required]").removeClass("input-error");         
            $(".input-show-error").hide();
           
            


        });

        //  Bấm button huỷ thì ẩn  From chi tiết nhân viên 
        $("#bnt-cancel").click(function (e) {
            e.preventDefault();
            $("#form-detail").hide();
            me.grid.find(".tr-active").removeClass("tr-active");
            $("[Required]").removeClass("input-error");         
            $(".input-show-error").hide();

        });
        //Xử lý sự đóng popup bằng nút x
        $(".bnt-close-popup").on("click", function (e) {
            $(".popup-detail").hide();
        })
        //Xử lý sự đóng popup  bằng nút huỷ
        $("#popup-cancel").on("click", function (e) {
            $(".popup-detail").hide();
        })
        //Xử lý sự đóng  toatast bằng nút x
        $("#toatast-colse").on("click", function (e) {
            $(".toatast-container").hide();
        })
         //Xử lý sự đóng popup bằng nút Ok
         $(".bnt-ok").on("click", function (e) {
            $(".popup-detail").hide();
        })

    }
    /*
     * Hàm dùng để  sử lý mở các popup 
     * PCTUANANH( 14/07/2022)
     */
    openPopup() {
        let me = this;
        //Xử lý mở  popup  xoá nhân viên
        $("#bnt-delete").on("click", function (e) {
            $("#isDelete").show();
        })

    }

    /*
     * Hàm dùng để  lưu form thêm, sửa 
     * PCTUANANH( 14/07/2022)
     */
    saveForm() {
        let me = this;
        $("#bnt-save").on("click", (function (e) {
            me.handleSavefrom();

        }));
        $("#bnt-save").on('keypress', function (e) {
            if (e.which == 13) {
                me.handleSavefrom();
            }
        });

    }
     /*
     * Hàm dùng để xử lý  lưu form thêm, sửa
     * PCTUANANH( 14/07/2022)
     */
     handleSavefrom(){
        let me = this;
        me.validateForm();
        var inputs = $("[propName]");
        var employee = {};

        for (let input of inputs) {
            let propName = $(input).attr("propName");
            let value = $(input).val();
            if (propName === "workStatus" || propName === "gender") {
                value = parseInt(value);
            }
            if (propName == "salary") {
                value = CommonFn.formatMoneyInt(value);
            }
            if (!value) {
                continue;
            }
            employee[propName] = value;

        }



        if (me.FormMode === Enumeration.FormMode.Add) {
            employee.employeeID = "2f25f1cb-fd4b-11ec-b2bc-847beb21fa4f";
            me.postEmployee(employee);

        }

        if (me.FormMode === Enumeration.FormMode.Edit) {
            me.putEmployee(employee);

        }

     }
    /*
     * Hàm dùng để sử lý sự kiện  xoá một nhân viên  theo id
     * PCTUANANH( 15/07/2022)
     */
    deleteTrEmployee() {
        let me = this;
        me.grid.on("click", " tbody tr", function (e) {
            me.isDelete = true;
            e.preventDefault();
            const emp = $(this).data().emp;
            let id = emp.employeeID;
            $("#bnt-delete").on("click", function (e) {
                if (me.isDelete == true) {
                    $("#isSelect-Delete").hide();
                    $("#isDelete").show();
                    e.preventDefault();
                    $("#content-delete").text(`Bạn muốn xoá nhân viên có mã là ${emp.employeeCode} và có tên là ${emp.employeeName}`);
                    $("#bnt-delete-popup").on("click", function (e) {
                        me.deleteEmployee(id);
                        e.preventDefault();
                        me.isDelete = false;

                    })
                }



            })
        });
        if (me.isDelete == false) {
            $("#bnt-delete").click(function (e) {
                e.preventDefault();
                if (me.isDelete == false) {
                    $("#isDelete").hide();
                    $("#isSelect-Delete").show();

                }

            });
        }

    }
    /*
     * Hàm dùng để  xoá một nhân viên  theo id 
     * PCTUANANH( 15/07/2022)
     */
    deleteEmployee(id) {
        let me = this;
        let url = "http://localhost:5108/api/v1/Employees/" + id;
        $.ajax({
            type: "DELETE",
            url: url,
            dataType: "json",
            contentType: 'application/json',
            success: function (response) {
                $("#isDelete").hide();
                $("#toatast-container").show();
                $("#totast-content").text("Xoá thành công");
                setTimeout(() => {
                    $("#toatast-container").hide();
                }, 1500);
                me.getData();

            },
            error: function (res) {

            }
        });
    }
    /*
     * Hàm dùng để Duplicate employee
     * PCTUANANH( 14/07/2022)
     */
    duplicateEmployee() {
        let me = this;
        me.grid.on("click", " tbody tr", function (e) {
            me.FormMode = Enumeration.FormMode.Add;
            me.isDuplicate = true;
            var employee = $(this).data().emp;
            e.preventDefault();
            $("#bnt-dulicate").on("click", function (e) {
                if (me.isDuplicate == true) {
                    $("#isSelect-duplicate").hide();
                    $(".input-show-error").hide();
                    $("input").removeClass("input-error");
                    var inputs = $("[propName]");
                    for (let input of inputs) {
                        let propName = $(input).attr("propName");
                        let value = employee[propName];
                        if ($(input).attr("typeDate")) {
                            value = CommonFn.formatDate2(value);
                        }

                        if (propName === "salary") {
                            value = CommonFn.formatMoney(value);
                        }
                        $(input).val(value);
                    }
                    me.insertNewCode();

                    //Xử lý forcus vào input đàu tiên 

                    $("#form-detail").show();
                    me.focusInput();

                }
                me.isDuplicate == false;

            })
        });
        if (me.isDuplicate == false) {
            $("#bnt-dulicate").click(function (e) {
                e.preventDefault();
                if (me.isDelete == false) {
                    $("#isSelect-duplicate").show();
                    $("#form-detail").hide();
                }

            });
        }

    }
    /*
     * Hàm dùng để  thêm mới một nhân viên  
     * PCTUANANH( 19/07/2022)
     */
    postEmployee(employee) {
        let me = this;
        const url = "http://localhost:5108/api/v1/Employees"
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: JSON.stringify(employee),
            contentType: 'application/json',
            success: function (response) {

                $("#form-detail").hide();
                $("#toatast-container").show();
                $("#totast-content").text("Thêm mới thành công");
                me.getData();
                setTimeout(() => {
                    $("#toatast-container").hide();
                }, 1500);


            },
            error: function (response) { // error callback 
    
                me.vaildFormBE(response);

            }
        });
    }
    /*
     * Hàm dùng để load lại trang
     * PCTUANANH( 14/07/2022)
     */
    refreshPage() {
        let me = this;
        $("#bnt-refresh").on("click", function (e) {
            me.search = "";
            $("#search").val("");
            me.positionID = "";
            me.departmentID = "";
            me.getData();
            $("#department-filter").val("");
            $("#position-filter").val("");
            $("#select-Nub-emp").val(10);
            me.isDelete = false;
            me.isDuplicate = false;
            me.empNubershow = 10;

        })

    }
    /*
     * Hàm dùng để  sửa  một nhân viên 
     * PCTUANANH( 19/07/2022)
     */
    putEmployee(employee) {
        let me = this;
        let id = employee.employeeID;
        const url = "http://localhost:5108/api/v1/Employees/" + id;
        $.ajax({
            type: "PUT",
            url: url,
            dataType: "json",
            data: JSON.stringify(employee),
            contentType: 'application/json',
            success: function (response) {


                $("#form-detail").hide();
                $("#toatast-container").show();
                $("#totast-content").text("Sửa  thành công");
                me.getData();
                setTimeout(() => {
                    $("#toatast-container").hide();
                }, 1500);



            },
            error: function (response) { // error callback 
                me.vaildFormBE(response);
            }
        });
    }
    /*
     * Hàm dùng để  xử lý sắp xếp
     * PCTUANANH( 19/07/2022)
     */
    // sortEmployee() {
    //     let me = this;
    //     $("#table-employee th").on("click", function () {
    //         $(".sort-container").remove(); 
    //         let iconSortHTML = `
    //         <div class="sort-container">              
    //             <i class="fa-solid fa-sort-down "></i>
    //          </div>
    //         `
    //         $(this).append(iconSortHTML);         
    //         if (me.isSort) {
    //             $("#table-employee th i").addClass("sort-icon-change");
    //             me.isSort = !me.isSort;
    //         } else {
    //             $("#table-employee th i").removeClass("sort-icon-change");
    //             me.isSort = !me.isSort;

    //         }
    //         me.sortName = $(this).attr("sortName");
    //         me.getData();


    //     })
    // }

}
var employeePage = new EmployeePage("table-employee");
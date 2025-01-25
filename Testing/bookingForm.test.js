/**
 * @jest-environment jsdom
 */

const $ = require("jquery");

describe("Booking Form", () => {
  let $form;

  beforeEach(() => {
    // Load the HTML structure
    document.body.innerHTML = `
      <form id="addCustomerForm">
        <input type="text" id="nama" required />
        <input type="email" id="email" required />
        <input type="text" id="phone_number" required />
        <select id="jenis_room" required>
          <option value="" disabled selected>Pilih Jenis Room</option>
          <option value="Deluxe room" data-harga="1000000">Deluxe room</option>
          <option value="Junior suite" data-harga="500000">Junior suite</option>
        </select>
        <input type="text" id="harga" readonly />
        <input type="date" id="check_in_date" required />
        <input type="date" id="check_out_date" required />
        <button type="submit">Buat Pesanan</button>
      </form>
    `;

    // Bind jQuery to the global object
    global.$ = $(document);

    // Add event listeners as defined in the HTML file
    $("#jenis_room").change(function () {
      const harga = $(this).find(":selected").data("harga");
      $("#harga").val(harga ? harga.toLocaleString("id-ID") : "");
    });

    $("#addCustomerForm").submit(function (e) {
      e.preventDefault();
      const hargaString = $("#harga").val().replace(/\./g, "");
      const harga = parseInt(hargaString, 10);

      if (isNaN(harga)) {
        alert("Harga tidak valid. Pastikan harga diisi dengan benar.");
        return;
      }

      const data = {
        nama: $("#nama").val(),
        email: $("#email").val(),
        phone_number: $("#phone_number").val(),
        jenis_room: $("#jenis_room").val(),
        check_in_date: $("#check_in_date").val(),
        check_out_date: $("#check_out_date").val(),
        harga: harga,
      };

      console.log("Data yang dikirim:", data);
    });

    $form = $("#addCustomerForm");
  });

  test("should update price when room type is selected", () => {
    $("#jenis_room").val("Deluxe room").trigger("change");
    expect($("#harga").val()).toBe("1.000.000");
  });

  test("should set price to empty when no room type is selected", () => {
    $("#jenis_room").val("").trigger("change");
    expect($("#harga").val()).toBe("");
  });

  test("should not submit form with empty fields", () => {
    const spy = jest.spyOn(window, "alert").mockImplementation(() => {});
  
    $form.submit();
  
    expect(spy).toHaveBeenCalledWith("Harga tidak valid. Pastikan harga diisi dengan benar.");
    spy.mockRestore();
  });
  

  test("should log correct data on form submission", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    $("#nama").val("John Doe");
    $("#email").val("johndoe@example.com");
    $("#phone_number").val("08123456789");
    $("#jenis_room").val("Deluxe room").trigger("change");
    $("#check_in_date").val("2024-12-01");
    $("#check_out_date").val("2024-12-10");

    $form.submit();

    expect(consoleSpy).toHaveBeenCalledWith("Data yang dikirim:", {
      nama: "John Doe",
      email: "johndoe@example.com",
      phone_number: "08123456789",
      jenis_room: "Deluxe room",
      check_in_date: "2024-12-01",
      check_out_date: "2024-12-10",
      harga: 1000000,
    });

    consoleSpy.mockRestore();
  });
});
/**
 * @jest-environment jsdom
 */

const $ = require("jquery");

describe("Tambah Data Kamar Form", () => {
  let $form;

  beforeEach(() => {
    // Load the HTML structure
    document.body.innerHTML = `
      <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card" style="width: 100%; max-width: 600px;">
          <div class="card-header text-center bg-primary text-white">
            <h3>Tambah Data Kamar</h3>
          </div>
          <div class="card-body text-dark" style="background-color: whitesmoke;">
            <form action="/submitKamar" method="POST">
              <div class="form-group">
                <label for="namaKamar">Nama Kamar</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fas fa-sign"></i></span>
                  </div>
                  <input type="text" class="form-control" id="namaKamar" name="nama_kamar" required>
                </div>
              </div>
              <div class="form-group">
                <label for="hargaKamar">Harga Kamar</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fas fa-rupiah-sign"></i></span>
                  </div>
                  <input type="number" class="form-control" id="hargaKamar" name="harga_kamar" required>
                </div>
              </div>
              <div class="form-group">
                <label for="deskripsiKamar">Deskripsi Kamar</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fas fa-pencil-alt"></i></span>
                  </div>
                  <textarea class="form-control" id="deskripsiKamar" name="deskripsi_kamar" rows="3" required></textarea>
                </div>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-success">Simpan</button>
                <button type="button" class="btn btn-danger" id="btnCancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Bind jQuery to the global object
    global.$ = $(document);

    // Mock cancel button functionality
    $("#btnCancel").on("click", function () {
      $("form")[0].reset();
      window.location.href = "/indexAdmin";
    });

    $form = $("form");
  });

  test("should reset form and redirect to /indexAdmin when Cancel button is clicked", () => {
    delete window.location; // Remove the original location object
    window.location = { href: "" }; // Mock the location object

    $("#namaKamar").val("Room 101");
    $("#hargaKamar").val(500000);
    $("#deskripsiKamar").val("A cozy room for travelers.");

    $("#btnCancel").trigger("click");

    expect($("#namaKamar").val()).toBe("");
    expect($("#hargaKamar").val()).toBe("");
    expect($("#deskripsiKamar").val()).toBe("");
    expect(window.location.href).toBe("/indexAdmin");
  });

  test("should not submit form with empty fields", () => {
    const spy = jest.fn();
    $form.on("submit", (e) => {
      e.preventDefault();
      // Simulate form validation
      const isValid =
        $("#namaKamar").val() &&
        $("#hargaKamar").val() &&
        $("#deskripsiKamar").val();
      if (isValid) spy();
    });

    $form.trigger("submit");

    expect(spy).not.toHaveBeenCalled();
  });

  test("should submit form with valid inputs", () => {
    const spy = jest.fn();
    $form.on("submit", (e) => {
      e.preventDefault();
      spy();
    });

    $("#namaKamar").val("Room 101");
    $("#hargaKamar").val(500000);
    $("#deskripsiKamar").val("A cozy room for travelers.");

    $form.trigger("submit");

    expect(spy).toHaveBeenCalled();
  });
});

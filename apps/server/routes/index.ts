import { Router } from "express";
import { addressRouter } from "@/modules/address/address.route";
import { categoriesRouter } from "@/modules/categories/categories.route";
import { customerRouter } from "@/modules/customer/customer.route";
import { orderRouter } from "@/modules/order/order.route";
import { paymentRouter } from "@/modules/payment/payment.route";
import { productRouter } from "@/modules/product/product.route";

/**
 * Router utama untuk versi 1 (v1) dari API.
 *
 * Digunakan untuk mengelompokkan route dan middleware yang terkait dengan versi 1 aplikasi.
 * Semua route untuk API v1 harus didaftarkan di sini, dan router ini dipasang di aplikasi
 * Express utama dengan prefix seperti '/api/v1'.
 *
 * Contoh penggunaan:
 * // import v1Router dari file ini lalu daftarkan pada app utama:
 * // app.use('/api/v1', v1Router);
 *
 * @constant
 * @type {import('express').Router}
 * @public
 * @since 1.0.0
 */
const v1Router: Router = Router();

/**
 * Route ini menangani semua endpoint terkait produk.
 * Semua route yang berhubungan dengan data produk, managemen produk.
 * pengguna dikelola di dalam router ini.
 */
v1Router.use("/products", productRouter);

/**
 * Route ini menangani semua endpoint terkait kategori.
 * Semua route yang berhubungan dengan data kategori, managemen kategori.
 * dikelola di dalam router ini.
 */
v1Router.use("/categories", categoriesRouter);

/**
 * Route ini menangani semua endpoint terkait order.
 * Semua route yang berhubungan dengan data order, managemen order.
 * dikelola di dalam router ini.
 */
v1Router.use("/orders", orderRouter);

/**
 * Route ini menangani semua endpoint terkait address.
 * Semua route yang berhubungan dengan data address, managemen address.
 * dikelola di dalam router ini.
 */
v1Router.use("/address", addressRouter);

/**
 * Route ini menangani semua endpoint terkait payment.
 * Semua route yang berhubungan dengan data payment, managemen payment.
 * dikelola di dalam router ini.
 */
v1Router.use("/payment", paymentRouter);

/**
 * Route ini menangani semua endpoint terkait customer.
 * Semua route yang berhubungan dengan data customer, managemen customer.
 * dikelola di dalam router ini.
 */
v1Router.use("/customers", customerRouter);

export default v1Router;

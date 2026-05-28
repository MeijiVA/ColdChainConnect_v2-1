import "dotenv/config";
import { randomUUID } from "crypto";
import { db } from "./db";
import {
  users,
  customers,
  products,
  drivers,
  trucks,
  inventory_batches,
} from "./db/schema";
import { hashPassword } from "./auth";

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    // Create admin user
    console.log("📝 Creating admin user...");
    const adminUserId = randomUUID();
    const adminPassword = await hashPassword("admin123");

    await db.insert(users).values({
      id: adminUserId,
      username: "admin",
      password_hash: adminPassword,
      role: "admin",
    });

    // Create driver users
    console.log("📝 Creating driver users...");
    const driver1Id = randomUUID();
    const driver2Id = randomUUID();
    const driver3Id = randomUUID();

    const driverPassword = await hashPassword("driver123");

    await db.insert(users).values([
      {
        id: driver1Id,
        username: "driver1",
        password_hash: driverPassword,
        role: "driver",
      },
      {
        id: driver2Id,
        username: "driver2",
        password_hash: driverPassword,
        role: "driver",
      },
      {
        id: driver3Id,
        username: "driver3",
        password_hash: driverPassword,
        role: "driver",
      },
    ]);

    // Create products
    console.log("📝 Creating products...");
    const product1 = randomUUID();
    const product2 = randomUUID();
    const product3 = randomUUID();
    const product4 = randomUUID();

    await db.insert(products).values([
      {
        id: product1,
        name: "Chicken Breast",
        price: "150.00",
        batch_tracking_enabled: true,
      },
      {
        id: product2,
        name: "Pork Chops",
        price: "200.00",
        batch_tracking_enabled: true,
      },
      {
        id: product3,
        name: "Fish Fillet",
        price: "180.00",
        batch_tracking_enabled: true,
      },
      {
        id: product4,
        name: "Beef Steak",
        price: "250.00",
        batch_tracking_enabled: true,
      },
    ]);

    // Create customers
    console.log("📝 Creating customers...");
    const customer1 = randomUUID();
    const customer2 = randomUUID();
    const customer3 = randomUUID();

    await db.insert(customers).values([
      {
        id: customer1,
        store_name: "ABC Market - Makati",
        location: "Makati City",
        contact_info: "555-0001",
        agent_id: driver1Id,
      },
      {
        id: customer2,
        store_name: "XYZ Supermarket - BGC",
        location: "Bonifacio Global City",
        contact_info: "555-0002",
        agent_id: driver2Id,
      },
      {
        id: customer3,
        store_name: "Fresh Mart - Tagaytay",
        location: "Tagaytay City",
        contact_info: "555-0003",
        agent_id: driver3Id,
      },
    ]);

    // Create drivers
    console.log("📝 Creating drivers...");
    const driverProfile1 = randomUUID();
    const driverProfile2 = randomUUID();
    const driverProfile3 = randomUUID();

    await db.insert(drivers).values([
      {
        id: driverProfile1,
        user_id: driver1Id,
        address: "123 Main St, Makati",
        contact_info: "09171234567",
        is_active: true,
      },
      {
        id: driverProfile2,
        user_id: driver2Id,
        address: "456 BGC Ave, Taguig",
        contact_info: "09172345678",
        is_active: true,
      },
      {
        id: driverProfile3,
        user_id: driver3Id,
        address: "789 Tagaytay Rd",
        contact_info: "09173456789",
        is_active: true,
      },
    ]);

    // Create trucks
    console.log("📝 Creating trucks...");
    const truck1 = randomUUID();
    const truck2 = randomUUID();
    const truck3 = randomUUID();

    await db.insert(trucks).values([
      {
        id: truck1,
        name: "Truck A - Metro Manila",
        district: "Metro Manila",
        driver_id: driverProfile1,
        status: "available",
      },
      {
        id: truck2,
        name: "Truck B - Cavite",
        district: "Cavite",
        driver_id: driverProfile2,
        status: "available",
      },
      {
        id: truck3,
        name: "Truck C - Tagaytay",
        district: "Tagaytay",
        driver_id: driverProfile3,
        status: "available",
      },
    ]);

    // Create inventory batches
    console.log("📝 Creating inventory batches...");
    await db.insert(inventory_batches).values([
      {
        id: randomUUID(),
        product_id: product1,
        pallet_id: "P-2024-001",
        qty_units: 100,
        expiration_date_note: "2024-02-15",
        placement_location: "Freezer A",
      },
      {
        id: randomUUID(),
        product_id: product2,
        pallet_id: "P-2024-002",
        qty_units: 80,
        expiration_date_note: "2024-02-20",
        placement_location: "Freezer B",
      },
      {
        id: randomUUID(),
        product_id: product3,
        pallet_id: "P-2024-003",
        qty_units: 120,
        expiration_date_note: "2024-02-10",
        placement_location: "Freezer C",
      },
      {
        id: randomUUID(),
        product_id: product4,
        pallet_id: "P-2024-004",
        qty_units: 60,
        expiration_date_note: "2024-02-25",
        placement_location: "Freezer A",
      },
    ]);

    console.log("✅ Seed completed successfully!");
    console.log("\n📋 Created data:");
    console.log("   ✓ Admin user (admin/admin123)");
    console.log("   ✓ 3 Driver users (driver1-3/driver123)");
    console.log("   ✓ 4 Products (Chicken, Pork, Fish, Beef)");
    console.log("   ✓ 3 Customers (Makati, BGC, Tagaytay)");
    console.log("   ✓ 3 Drivers (with profiles)");
    console.log("   ✓ 3 Trucks (Metro Manila, Cavite, Tagaytay)");
    console.log("   ✓ 4 Inventory Batches/Pallets");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();

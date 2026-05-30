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
  batch_pallets,
  pallet_items,
  agents,
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
    }).onConflictDoNothing();

    // Create agent users (account-linked staff)
    console.log("📝 Creating agent users...");
    const agent1UserId = randomUUID();
    const agent2UserId = randomUUID();
    const agent3UserId = randomUUID();

    const agentPassword = await hashPassword("agent123");

    await db.insert(users).values([
      {
        id: agent1UserId,
        username: "agent1",
        password_hash: agentPassword,
        role: "agent",
      },
      {
        id: agent2UserId,
        username: "agent2",
        password_hash: agentPassword,
        role: "agent",
      },
      {
        id: agent3UserId,
        username: "agent3",
        password_hash: agentPassword,
        role: "agent",
      },
    ]).onConflictDoNothing();

    // Create products
    console.log("📝 Creating products...");
    const product1 = randomUUID();
    const product2 = randomUUID();
    const product3 = randomUUID();
    const product4 = randomUUID();

    await db.insert(products).values([
      { id: product1, name: "Chicken Breast", price: "150.00", batch_tracking_enabled: true },
      { id: product2, name: "Pork Chops", price: "200.00", batch_tracking_enabled: true },
      { id: product3, name: "Fish Fillet", price: "180.00", batch_tracking_enabled: true },
      { id: product4, name: "Beef Steak", price: "250.00", batch_tracking_enabled: true },
    ]).onConflictDoNothing();

    // Create agent profiles
    console.log("📝 Creating agent profiles...");
    const agentProfile1 = randomUUID();
    const agentProfile2 = randomUUID();
    const agentProfile3 = randomUUID();

    await db.insert(agents).values([
      {
        id: agentProfile1,
        user_id: agent1UserId,
        full_name: "Maria Santos",
        email: "maria.santos@coldchain.com",
        contact_info: "09171234567",
        hire_date: "2022-01-15",
        address: "123 Main St, Makati",
        is_active: true,
      },
      {
        id: agentProfile2,
        user_id: agent2UserId,
        full_name: "Juan Dela Cruz",
        email: "juan.delacruz@coldchain.com",
        contact_info: "09172345678",
        hire_date: "2022-03-10",
        address: "456 BGC Ave, Taguig",
        is_active: true,
      },
      {
        id: agentProfile3,
        user_id: agent3UserId,
        full_name: "Ana Reyes",
        email: "ana.reyes@coldchain.com",
        contact_info: "09173456789",
        hire_date: "2023-06-01",
        address: "789 Tagaytay Rd, Cavite",
        is_active: true,
      },
    ]).onConflictDoNothing();

    // Create customers (linked to agent users)
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
        agent_id: agent1UserId,
      },
      {
        id: customer2,
        store_name: "XYZ Supermarket - BGC",
        location: "Bonifacio Global City",
        contact_info: "555-0002",
        agent_id: agent2UserId,
      },
      {
        id: customer3,
        store_name: "Fresh Mart - Tagaytay",
        location: "Tagaytay City",
        contact_info: "555-0003",
        agent_id: agent3UserId,
      },
    ]).onConflictDoNothing();

    // Create drivers (standalone, no login account)
    console.log("📝 Creating drivers...");
    const driverProfile1 = randomUUID();
    const driverProfile2 = randomUUID();
    const driverProfile3 = randomUUID();

    await db.insert(drivers).values([
      {
        id: driverProfile1,
        full_name: "Pedro Reyes",
        contact_info: "09181234567",
        license: "N01-23-111111",
        hire_date: "2021-05-10",
        employment_type: "full_time",
        is_active: true,
      },
      {
        id: driverProfile2,
        full_name: "Carlos Mendoza",
        contact_info: "09182345678",
        license: "N01-23-222222",
        hire_date: "2021-08-20",
        employment_type: "full_time",
        is_active: true,
      },
      {
        id: driverProfile3,
        full_name: "Jose Villanueva",
        contact_info: "09183456789",
        license: "N01-23-333333",
        hire_date: "2022-02-14",
        employment_type: "part_time",
        is_active: true,
      },
    ]).onConflictDoNothing();

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
    ]).onConflictDoNothing();

    // Create inventory batches
    console.log("📝 Creating inventory batches...");
    const batchId1 = randomUUID();
    await db.insert(inventory_batches).values({
      id: batchId1,
      batch_name: "Morning Delivery",
    }).onConflictDoNothing();

    const pallet1Id = randomUUID();
    const pallet2Id = randomUUID();
    await db.insert(batch_pallets).values([
      {
        id: pallet1Id,
        batch_id: batchId1,
        pallet_id: "P-2024-001",
        supplier_name: "Frabelle Food Corp",
        received_date: "2024-01-15",
        storage_zone: "Zone A",
        placement_location: "Freezer A",
      },
      {
        id: pallet2Id,
        batch_id: batchId1,
        pallet_id: "P-2024-002",
        supplier_name: "Polar Foods",
        received_date: "2024-01-16",
        storage_zone: "Zone B",
        placement_location: "Freezer B",
      },
    ]).onConflictDoNothing();

    await db.insert(pallet_items).values([
      { id: randomUUID(), pallet_id: pallet1Id, product_id: product1, qty_units: 100, expiration_date_note: "2024-02-15" },
      { id: randomUUID(), pallet_id: pallet1Id, product_id: product2, qty_units: 80, expiration_date_note: "2024-02-20" },
      { id: randomUUID(), pallet_id: pallet2Id, product_id: product3, qty_units: 120, expiration_date_note: "2024-02-10" },
      { id: randomUUID(), pallet_id: pallet2Id, product_id: product4, qty_units: 60, expiration_date_note: "2024-02-25" },
    ]).onConflictDoNothing();

    console.log("✅ Seed completed successfully!");
    console.log("\n📋 Created data:");
    console.log("   ✓ Admin user (admin/admin123)");
    console.log("   ✓ 3 Agent users (agent1-3/agent123) with profiles");
    console.log("   ✓ 4 Products (Chicken, Pork, Fish, Beef)");
    console.log("   ✓ 3 Customers (Makati, BGC, Tagaytay)");
    console.log("   ✓ 3 Drivers (Pedro, Carlos, Jose — no login)");
    console.log("   ✓ 3 Trucks (Metro Manila, Cavite, Tagaytay)");
    console.log("   ✓ Inventory Batches/Pallets");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();

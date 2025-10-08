const RideInfo = require('../ride-info/models')
const RideStatus = require('../ride_status/models')
const Driver = require('../driver_registration/models')
const Vehicle = require('../vehicle/models')

module.exports = {
    // 🚀 Expose Ride to Network
    exposeRide: async (req, res) => {
        try {
            const { rideId, driverId } = req.body;

            // Verify the ride belongs to the requesting driver
            const ride = await RideInfo.findOne({ where: { id: rideId, driver_id: driverId } });
            if (!ride) {
                return res.status(404).json({ success: false, message: "Ride not found or not owned by this driver" });
            }

            // Mark ride as exposed
            await ride.update({ is_exposed: true }); // add column if not present

            return res.json({ success: true, message: "Ride exposed to network successfully" });
        } catch (err) {
            console.error("❌ ExposeRide Error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    // ✅ Accept Ride from Network
    acceptRide: async (req, res) => {
        try {
            const { rideId, newDriverId } = req.body;

            // 1️⃣ Check if ride exists and is currently exposed
            const ride = await RideInfo.findOne({ where: { id: rideId, is_exposed: true } });
            if (!ride) {
                return res
                    .status(404)
                    .json({ success: false, message: "Ride not found or not exposed to network" });
            }

            // 2️⃣ Ensure new driver exists
            const newDriver = await Driver.findByPk(newDriverId);
            if (!newDriver) {
                return res.status(404).json({ success: false, message: "New driver not found" });
            }

            // 3️⃣ Find the vehicle assigned to this driver
            const assignedVehicle = await Vehicle.findOne({ where: { driver_id: newDriverId } });
            if (!assignedVehicle) {
                return res
                    .status(400)
                    .json({ success: false, message: "No vehicle found for this driver" });
            }

            // 4️⃣ Update RideInfo: assign new driver and vehicle, mark as not exposed
            await RideInfo.update(
                {
                    driver_id: newDriverId,
                    vehicle_id: assignedVehicle.id,
                    is_exposed: false,
                },
                { where: { id: rideId } }
            );

            // 5️⃣ Update RideStatus: assign new driver
            await RideStatus.update(
                { driver_id: newDriverId },
                { where: { ride_id: rideId } } // ensure RideStatus has ride_id foreign key
            );

            // 6️⃣ Return success
            return res.json({
                success: true,
                message: "Ride accepted and driver reassigned successfully",
                data: {
                    ride_id: rideId,
                    new_driver_id: newDriverId,
                    new_vehicle_id: assignedVehicle.id,
                },
            });
        } catch (err) {
            console.error("❌ AcceptRide Error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
    },


    // 🧭 Get All Exposed Rides (for drivers browsing the network)
    getExposedRides: async (req, res) => {
        try {
            const rides = await RideInfo.findAll({
                where: { is_exposed: true },
                include: [{ model: Driver, attributes: ['id', 'name'] }],
            });

            return res.json({ success: true, rides });
        } catch (err) {
            console.error("❌ GetExposedRides Error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
    },
};

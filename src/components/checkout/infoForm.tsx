import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm, Controller } from 'react-hook-form';
import * as v from 'valibot';
import { isValidPhoneNumber } from 'react-phone-number-input/max';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phoneInput';

const schema = v.object({
  first_name: v.pipe(v.string(), v.trim(), v.nonEmpty()),
  last_name: v.pipe(v.string(), v.trim(), v.nonEmpty()),
  email: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.email()),
  phone_number: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(),
    v.check(isValidPhoneNumber, 'Invalid phone number'),
  ),
  address: v.pipe(v.string(), v.trim(), v.nonEmpty()),
  city: v.pipe(v.string(), v.trim(), v.nonEmpty()),
  state: v.pipe(v.string(), v.trim(), v.nonEmpty()),
  postal_code: v.pipe(v.string(), v.trim(), v.nonEmpty()),
});

export type InfoFormValues = v.InferOutput<typeof schema>;

export function InfoForm({
  onSubmit,
}: {
  onSubmit: (data: InfoFormValues) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InfoFormValues>({
    mode: 'onTouched',
    resolver: valibotResolver(schema),
    defaultValues: {
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '+201064610000',
      email: 'example@email.com',
      city: 'Nasr City',
      postal_code: '11828',
      state: 'Cairo',
      address: 'Ahmed Fakhry street, Building 22',
    },
  });

  return (
    <>
      <h2 id="payment-and-shipping-heading" className="sr-only">
        Payment and shipping details
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
          <div>
            <h3 className="font-medium text-bolder">Contact</h3>
            <p className="text-subtle text-sm">
              Enter your contact information
            </p>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <Input
                label="First name"
                {...register('first_name')}
                isError={!!errors?.first_name}
              />
              <Input
                id="last_name"
                label="Last name"
                {...register('last_name')}
                isError={!!errors?.last_name}
              />
              <Controller
                control={control}
                name="phone_number"
                render={({ field, fieldState }) => (
                  <PhoneInput {...field} isError={!!fieldState.error} />
                )}
              />
              <Input
                id="email"
                label="Email address"
                {...register('email')}
                isError={!!errors?.email}
              />
            </div>
          </div>

          <div className="mt-10">
            <h3 className="font-medium text-bolder">Address</h3>
            <p className="text-subtle text-sm">
              Enter your address information
            </p>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <Input
                label="Address"
                {...register('address')}
                isError={!!errors?.address}
                containerClassName="col-span-full"
              />
              <Input
                label="City"
                {...register('city')}
                isError={!!errors?.city}
              />
              <Input
                label="State"
                {...register('state')}
                isError={!!errors?.state}
              />
              <Input
                label="Postal code"
                {...register('postal_code')}
                isError={!!errors?.postal_code}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 justify-end">
            <Button
              type="submit"
              className="disabled:opacity-50 disabled:cursor-progress"
              size="lg"
              disabled={isSubmitting}
            >
              Proceed to payment
            </Button>
            <Button asChild className="w-full" size="lg" variant="ghost">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
